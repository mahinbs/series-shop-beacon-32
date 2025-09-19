-- Create RPC function to safely move comic page to new position
CREATE OR REPLACE FUNCTION public.move_comic_page(
    p_episode_id uuid,
    p_page_id uuid, 
    p_new_number integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_number integer;
    temp_number integer;
BEGIN
    -- Get current page number
    SELECT page_number INTO current_number 
    FROM public.comic_pages 
    WHERE id = p_page_id AND episode_id = p_episode_id;
    
    IF current_number IS NULL THEN
        RAISE EXCEPTION 'Page not found';
    END IF;
    
    -- If already at target position, do nothing
    IF current_number = p_new_number THEN
        RETURN;
    END IF;
    
    -- Find a temporary number that doesn't exist
    SELECT COALESCE(MAX(page_number), 0) + 10000 INTO temp_number
    FROM public.comic_pages 
    WHERE episode_id = p_episode_id;
    
    -- Step 1: Move current page to temporary position
    UPDATE public.comic_pages 
    SET page_number = temp_number, updated_at = NOW()
    WHERE id = p_page_id;
    
    -- Step 2: Shift other pages
    IF current_number < p_new_number THEN
        -- Moving down: shift pages up
        UPDATE public.comic_pages 
        SET page_number = page_number - 1, updated_at = NOW()
        WHERE episode_id = p_episode_id 
        AND page_number > current_number 
        AND page_number <= p_new_number
        AND id != p_page_id;
    ELSE
        -- Moving up: shift pages down  
        UPDATE public.comic_pages 
        SET page_number = page_number + 1, updated_at = NOW()
        WHERE episode_id = p_episode_id 
        AND page_number >= p_new_number 
        AND page_number < current_number
        AND id != p_page_id;
    END IF;
    
    -- Step 3: Move current page to final position
    UPDATE public.comic_pages 
    SET page_number = p_new_number, updated_at = NOW()
    WHERE id = p_page_id;
END;
$$;
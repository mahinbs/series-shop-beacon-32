
// This file augments Supabase's User type to allow optional legacy fields
// used in a few components (e.g., user.name, user.avatar).
// It does not change runtime behavior; it only helps TypeScript.
import 'tslib';
declare module '@supabase/supabase-js' {
  interface User {
    name?: string | null;
    avatar?: string | null;
  }
}

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Save, Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const DigitalReaderManager = () => {
  const [specs, setSpecs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [specForm, setSpecForm] = useState({
    title: '',
    creator: '',
    status: 'ongoing',
    tagsInput: '',
    tags: [] as string[],
    cover_image_url: '',
    description: ''
  });
  const [selectedSpecId, setSelectedSpecId] = useState('');
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [editingEpisodeId, setEditingEpisodeId] = useState<string>('');
  const [episodeForm, setEpisodeForm] = useState({
    chapter_number: 1,
    title: '',
    cover_image_url: '',
    is_free: false,
    coin_cost: 0
  });
  const [pages, setPages] = useState<{ page_number: number; image_url: string }[]>([]);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [isEditSpecOpen, setIsEditSpecOpen] = useState(false);
  const [editingSpecId, setEditingSpecId] = useState<string>('');
  const [editSpecForm, setEditSpecForm] = useState({
    title: '',
    creator: '',
    status: 'ongoing',
    tagsInput: '',
    tags: [] as string[],
    cover_image_url: '',
    description: ''
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('digital_reader_specs').select('*').order('display_order');
      setSpecs(data || []);
    })();
  }, []);

  const refreshSpecs = async () => {
    const { data } = await supabase.from('digital_reader_specs').select('*').order('display_order');
    setSpecs(data || []);
  };

  const addTag = () => {
    const t = specForm.tagsInput.trim();
    if (!t) return;
    if (specForm.tags.includes(t)) { setSpecForm({ ...specForm, tagsInput: '' }); return; }
    setSpecForm({ ...specForm, tags: [...specForm.tags, t], tagsInput: '' });
  };

  const removeTag = (t: string) => {
    setSpecForm({ ...specForm, tags: specForm.tags.filter(x => x !== t) });
  };

  const addEditTag = () => {
    const t = editSpecForm.tagsInput.trim();
    if (!t) return;
    if (editSpecForm.tags.includes(t)) { setEditSpecForm({ ...editSpecForm, tagsInput: '' }); return; }
    setEditSpecForm({ ...editSpecForm, tags: [...editSpecForm.tags, t], tagsInput: '' });
  };

  const removeEditTag = (t: string) => {
    setEditSpecForm({ ...editSpecForm, tags: editSpecForm.tags.filter(x => x !== t) });
  };

  const loadEpisodes = async (specId: string) => {
    if (!specId) { setEpisodes([]); return; }
    const { data, error } = await (supabase as any)
      .from('digital_reader_episodes')
      .select('id, chapter_number, title, cover_image_url, is_free, coin_cost, updated_at')
      .eq('spec_id', specId)
      .order('chapter_number');
    if (!error) setEpisodes(data || []);
  };

  const loadPagesForEpisode = async (episodeId: string) => {
    const { data, error } = await (supabase as any)
      .from('digital_reader_pages')
      .select('page_number, image_url')
      .eq('episode_id', episodeId)
      .order('page_number');
    if (!error) setPages((data || []).map((p: any) => ({ page_number: p.page_number, image_url: p.image_url })));
  };

  useEffect(() => {
    loadEpisodes(selectedSpecId);
    setEditingEpisodeId('');
    setEpisodeForm({ chapter_number: 1, title: '', cover_image_url: '', is_free: false, coin_cost: 0 });
    setPages([]);
  }, [selectedSpecId]);

  const uploadToBucket = async (file: File, pathPrefix: string) => {
    const ext = file.name.split('.').pop();
    const filePath = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('comic-pages').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('comic-pages').getPublicUrl(filePath);
    return data.publicUrl as string;
  };

  const createSpec = async () => {
    const payload: any = {
      title: specForm.title,
      artist: specForm.creator,
      status: specForm.status,
      genre: specForm.tags,
      cover_image_url: specForm.cover_image_url,
      description: specForm.description,
      is_active: true,
      display_order: 0
    };
    const { error } = await supabase.from('digital_reader_specs').insert([payload]);
    if (error) {
      alert(`Failed to add digital comic: ${error.message || 'Unknown error'}`);
      return;
    }
    await refreshSpecs();
    setSpecForm({ title: '', creator: '', status: 'ongoing', tagsInput: '', tags: [], cover_image_url: '', description: '' });
    setActiveTab('list');
  };

  const deleteSpec = async (id: string, title: string) => {
    const ok = window.confirm(`Delete "${title}"? This will remove all episodes and pages for this comic.`);
    if (!ok) return;
    const { error } = await supabase.from('digital_reader_specs').delete().eq('id', id);
    if (error) { alert(`Delete failed: ${error.message || 'Unknown error'}`); return; }
    await refreshSpecs();
  };

  const openEditSpec = (s: any) => {
    setEditingSpecId(s.id);
    let parsedTags: string[] = [];
    if (Array.isArray(s.genre)) {
      parsedTags = s.genre as string[];
    } else if (typeof s.genre === 'string') {
      // try JSON first, then fallback to comma-separated
      try {
        const j = JSON.parse(s.genre);
        if (Array.isArray(j)) parsedTags = j.filter(Boolean);
        else if (typeof j === 'string') parsedTags = j.split(',').map((t: string) => t.trim()).filter(Boolean);
      } catch {
        parsedTags = s.genre.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }
    setEditSpecForm({
      title: s.title || '',
      creator: s.artist || s.creator || '',
      status: s.status || 'ongoing',
      tagsInput: '',
      tags: parsedTags,
      cover_image_url: s.cover_image_url || '',
      description: s.description || ''
    });
    setIsEditSpecOpen(true);
  };

  const updateSpec = async () => {
    if (!editingSpecId) return;
    const payload: any = {
      title: editSpecForm.title,
      artist: editSpecForm.creator,
      status: editSpecForm.status,
      genre: editSpecForm.tags,
      cover_image_url: editSpecForm.cover_image_url,
      description: editSpecForm.description
    };
    const { error } = await supabase.from('digital_reader_specs').update(payload).eq('id', editingSpecId);
    if (error) { alert(`Failed to update comic: ${error.message || 'Unknown error'}`); return; }
    setIsEditSpecOpen(false);
    setEditingSpecId('');
    await refreshSpecs();
  };

  const saveEpisodeWithPages = async () => {
    if (!selectedSpecId) return;
    // require at least one valid page
    const validPages = pages.filter(p => p.image_url && p.image_url.trim() !== '');
    if (validPages.length === 0) { alert('Please add at least one page with an image before saving the episode.'); return; }

    if (editingEpisodeId) {
      const { error } = await (supabase as any)
        .from('digital_reader_episodes')
        .update({
          chapter_number: episodeForm.chapter_number,
          title: episodeForm.title,
          cover_image_url: episodeForm.cover_image_url,
          is_free: episodeForm.is_free,
          coin_cost: episodeForm.coin_cost
        })
        .eq('id', editingEpisodeId);
      if (error) { alert(`Failed to update episode: ${error.message}`); return; }

      // replace pages
      const del = await (supabase as any).from('digital_reader_pages').delete().eq('episode_id', editingEpisodeId);
      if (del.error) { alert(`Failed to clear pages: ${del.error.message}`); return; }
      const rows = validPages.map(p => ({ episode_id: editingEpisodeId, page_number: p.page_number, image_url: p.image_url }));
      const ins = await (supabase as any).from('digital_reader_pages').insert(rows);
      if (ins.error) { alert(`Failed to save pages: ${ins.error.message}`); return; }

      await loadEpisodes(selectedSpecId);
      alert('Episode updated');
    } else {
      const insEp = await (supabase as any).from('digital_reader_episodes').insert([
        {
          spec_id: selectedSpecId,
          chapter_number: episodeForm.chapter_number,
          title: episodeForm.title,
          cover_image_url: episodeForm.cover_image_url,
          is_free: episodeForm.is_free,
          coin_cost: episodeForm.coin_cost,
          is_published: true
        }
      ]).select('id').single();
      if (insEp.error) {
        if (String(insEp.error.code) === '23505' || String(insEp.error.message || '').toLowerCase().includes('duplicate key')) {
          alert('Duplicate chapter number: This chapter number already exists for this comic. Choose a different number.');
      } else {
          alert(`Failed to add episode: ${insEp.error.message || 'Unknown error'}`);
        }
        return;
      }
      const newEpisodeId = insEp.data.id;
      const rows = validPages.map(p => ({ episode_id: newEpisodeId, page_number: p.page_number, image_url: p.image_url }));
      const insPages = await (supabase as any).from('digital_reader_pages').insert(rows);
      if (insPages.error) { alert(`Failed to save pages: ${insPages.error.message}`); return; }

      await loadEpisodes(selectedSpecId);
      alert('Episode added');
    }

    setEditingEpisodeId('');
    setEpisodeForm({ chapter_number: 1, title: '', cover_image_url: '', is_free: false, coin_cost: 0 });
    setPages([]);
    setIsEpisodeModalOpen(false);
  };

  const addPageRow = () => { setPages((p) => [...p, { page_number: p.length + 1, image_url: '' }])};

  const savePages = async () => { /* no-op: handled in saveEpisodeWithPages via modal */ };

  const editEpisode = async (ep: any) => {
    setEditingEpisodeId(ep.id);
    setEpisodeForm({
      chapter_number: ep.chapter_number,
      title: ep.title,
      cover_image_url: ep.cover_image_url || '',
      is_free: !!ep.is_free,
      coin_cost: ep.coin_cost || 0
    });
    await loadPagesForEpisode(ep.id);
    setIsEpisodeModalOpen(true);
  };

  const deleteEpisode = async (id: string) => {
    const ok = window.confirm('Delete this episode? This will remove its pages as well.');
    if (!ok) return;
    const { error } = await (supabase as any)
      .from('digital_reader_episodes')
      .delete()
      .eq('id', id);
    if (error) { alert(`Failed to delete episode: ${error.message}`); return; }
    await loadEpisodes(selectedSpecId);
    if (editingEpisodeId === id) {
      setEditingEpisodeId('');
      setEpisodeForm({ chapter_number: 1, title: '', cover_image_url: '', is_free: false, coin_cost: 0 });
      setPages([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Digital Reader Management</h2>
          <p className="text-muted-foreground">Manage digital reader specifications and content</p>
        </div>
        <Button onClick={() => setActiveTab('add')}><Plus className="w-4 h-4 mr-2" />Add Digital Comic</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="add">Add</TabsTrigger>
          <TabsTrigger value="episodes">Episodes</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
            <div className="grid gap-4">
            {specs.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  {s.cover_image_url && (<img src={s.cover_image_url} className="w-16 h-20 object-cover rounded" />)}
                      <div className="flex-1">
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-muted-foreground">by (Artist) {s.artist || s.creator} • {s.status}</div>
                    {Array.isArray(s.genre) && s.genre.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">{s.genre.join(', ')}</div>
                          )}
                        </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => openEditSpec(s)}>Edit</Button>
                    <Button variant="outline" onClick={() => { setSelectedSpecId(s.id); setActiveTab('episodes'); }}>Manage Episodes</Button>
                    <Button variant="outline" onClick={() => deleteSpec(s.id, s.title)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>

        {/* Edit Spec Modal */}
        <Dialog open={isEditSpecOpen} onOpenChange={setIsEditSpecOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Digital Comic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={editSpecForm.title} onChange={(e) => setEditSpecForm({ ...editSpecForm, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>By (Artist)</Label>
                  <Input value={editSpecForm.creator} onChange={(e) => setEditSpecForm({ ...editSpecForm, creator: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={editSpecForm.status} onChange={(e) => setEditSpecForm({ ...editSpecForm, status: e.target.value })} placeholder="ongoing | completed | hiatus" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input value={editSpecForm.tagsInput} onChange={(e) => setEditSpecForm({ ...editSpecForm, tagsInput: e.target.value })} placeholder="Enter tag" />
                    <Button type="button" variant="outline" onClick={addEditTag}><Plus className="w-4 h-4" /></Button>
                  </div>
                  {editSpecForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editSpecForm.tags.map(t => (
                        <span key={t} className="px-2 py-1 text-xs rounded bg-gray-700 text-white inline-flex items-center gap-2">
                          {t}
                          <button onClick={() => removeEditTag(t)} className="text-gray-300 hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description (About)</Label>
                  <Textarea value={editSpecForm.description} onChange={(e) => setEditSpecForm({ ...editSpecForm, description: e.target.value })} rows={4} placeholder="Short description for About section" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Cover Image</Label>
                  <div className="flex gap-2">
                    <Input value={editSpecForm.cover_image_url} onChange={(e) => setEditSpecForm({ ...editSpecForm, cover_image_url: e.target.value })} placeholder="https://..." />
                    <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                      <Upload className="w-4 h-4" /> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return; const url = await uploadToBucket(f, 'covers'); setEditSpecForm({ ...editSpecForm, cover_image_url: url });
                      }} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={updateSpec}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <TabsContent value="add">
          <Card>
            <CardHeader><CardTitle>Add Digital Comic</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={specForm.title} onChange={(e) => setSpecForm({ ...specForm, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                  <Label>By (Artist)</Label>
                  <Input value={specForm.creator} onChange={(e) => setSpecForm({ ...specForm, creator: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={specForm.status} onChange={(e) => setSpecForm({ ...specForm, status: e.target.value })} placeholder="ongoing | completed | hiatus" />
                    </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input value={specForm.tagsInput} onChange={(e) => setSpecForm({ ...specForm, tagsInput: e.target.value })} placeholder="Enter tag" />
                    <Button type="button" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
                    </div>
                  {specForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {specForm.tags.map(t => (
                        <span key={t} className="px-2 py-1 text-xs rounded bg-gray-700 text-white inline-flex items-center gap-2">
                          {t}
                          <button onClick={() => removeTag(t)} className="text-gray-300 hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                    </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description (About)</Label>
                  <Textarea value={specForm.description} onChange={(e) => setSpecForm({ ...specForm, description: e.target.value })} rows={4} placeholder="Short description for About section" />
                    </div>
                    
                <div className="space-y-2 md:col-span-2">
                  <Label>Cover Image</Label>
                  <div className="flex gap-2">
                    <Input value={specForm.cover_image_url} onChange={(e) => setSpecForm({ ...specForm, cover_image_url: e.target.value })} placeholder="https://..." />
                    <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                      <Upload className="w-4 h-4" /> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return; const url = await uploadToBucket(f, 'covers'); setSpecForm({ ...specForm, cover_image_url: url });
                      }} />
                    </label>
                    </div>
                    </div>
                    </div>
              <Button onClick={createSpec}><Save className="w-4 h-4 mr-2" />Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="episodes">
          {!selectedSpecId ? (
            <Card><CardContent className="p-6">Select a digital comic from List to manage episodes.</CardContent></Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div />
                <Button onClick={() => { setEditingEpisodeId(''); setEpisodeForm({ chapter_number: 1, title: '', cover_image_url: '', is_free: false, coin_cost: 0 }); setPages([]); setIsEpisodeModalOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />Add Episode
                </Button>
                    </div>
                    
              <Card>
                <CardHeader><CardTitle>Existing Episodes</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {episodes.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No episodes yet.</div>
                  ) : episodes.map(ep => (
                    <div key={ep.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">#{ep.chapter_number} {ep.title}</div>
                        <div className="text-xs text-muted-foreground">Updated {new Date(ep.updated_at).toLocaleDateString()} • {ep.is_free ? 'Free' : `${ep.coin_cost} coins`}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editEpisode(ep)}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteEpisode(ep.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Dialog open={isEpisodeModalOpen} onOpenChange={setIsEpisodeModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingEpisodeId ? 'Edit Episode' : 'Add Episode'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Label>Chapter Number</Label>
                    <Input type="number" value={episodeForm.chapter_number} onChange={(e) => setEpisodeForm({ ...episodeForm, chapter_number: parseInt(e.target.value) || 1 })} />
                    <Label>Title</Label>
                    <Input value={episodeForm.title} onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })} />
                    <Label>Episode Cover</Label>
                    <div className="flex gap-2">
                      <Input value={episodeForm.cover_image_url} onChange={(e) => setEpisodeForm({ ...episodeForm, cover_image_url: e.target.value })} placeholder="https://..." />
                      <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                        <Upload className="w-4 h-4" /> Upload
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const f = e.target.files?.[0]; if (!f) return; const url = await uploadToBucket(f, `episodes/${selectedSpecId}/covers`); setEpisodeForm({ ...episodeForm, cover_image_url: url });
                        }} />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Label className="w-24">Free?</Label>
                        <input type="checkbox" checked={episodeForm.is_free} onChange={(e) => setEpisodeForm({ ...episodeForm, is_free: e.target.checked, coin_cost: e.target.checked ? 0 : episodeForm.coin_cost })} />
                  </div>
                      {!episodeForm.is_free && (
                        <div className="flex items-center gap-2">
                          <Label className="w-32">Coin Cost</Label>
                          <Input type="number" value={episodeForm.coin_cost} onChange={(e) => setEpisodeForm({ ...episodeForm, coin_cost: parseInt(e.target.value) || 0 })} />
                  </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium">Pages</div>
                      <Button variant="outline" onClick={() => setPages((p) => [...p, { page_number: p.length + 1, image_url: '' }])}><Plus className="w-4 h-4 mr-2" />Add Page</Button>
                      {pages.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input type="number" value={p.page_number} onChange={(e) => { const n = parseInt(e.target.value) || 1; const copy = [...pages]; copy[idx].page_number = n; setPages(copy); }} className="w-24" />
                          <Input value={p.image_url} onChange={(e) => { const copy = [...pages]; copy[idx].image_url = e.target.value; setPages(copy); }} placeholder="https://..." />
                          <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                            <Upload className="w-4 h-4" /> Upload
                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                              const f = e.target.files?.[0]; if (!f) return; const url = await uploadToBucket(f, `episodes/${selectedSpecId}/pages`); const copy = [...pages]; copy[idx].image_url = url; setPages(copy);
                            }} />
                          </label>
                          <Button variant="outline" size="icon" onClick={() => setPages((pv) => pv.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveEpisodeWithPages}><Save className="w-4 h-4 mr-2" />Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
                  </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalReaderManager;

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kbxlhysinmantixvtwda.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2krOxY0R-uafUuXs_KFJdg_8GP09_kx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

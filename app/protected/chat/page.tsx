import React from 'react';
import Chat from './Chat';
import { createClient } from '@/lib/supabase/server';

const  Page = async () => {
    const supabase = await createClient();
    const user= await supabase.auth.getUser()
    return (
        <main className='flex flex-col'>
            <Chat user={user?.data?.user?.id}/>
        </main>
    );
}

export default Page;

"use client"

import usePlayer from '@/hooks/usePlayer'
import React from 'react'
import useGetSongById from './useGetSongById';
import useLoadSongUrl from '@/hooks/useLoadSongUrl';
import PlayerContent from './PlayerContent';

function Player() {
    const player = usePlayer();
    const {song} = useGetSongById(player.activeId);

    const songUrl = useLoadSongUrl(song!);

    if(!song|| !songUrl || !player.activeId)
    {    return null;
    }

    // console.log(songUrl)

  return (
    <div className='fixed bottom-0 bg-black w-full py-2 h-[80px] px-4'><PlayerContent key={songUrl} song={song} songUrl={songUrl}/></div> 
    //using key here to destroy and re-render the component as useSound hook does not work dynamically
  )
}

export default Player
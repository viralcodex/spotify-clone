"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface LibraryProps {
  songs: Song[];
}
const Library : React.FC<LibraryProps>= ({songs}) => {
  const authModal = useAuthModal();
  const {user, subscription} = useUser();
  const uploadModal = useUploadModal();
  const subscribeModal = useSubscribeModal();
  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if(!user) return authModal.onOpen();

    //TODO: check for subscription
    if(!subscription)
      subscribeModal.onOpen()
    
    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">Your Library</p>
        </div>
          <AiOutlinePlus
            onClick={onClick}
            size={20}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
      </div>
      <div className="flex flex-col gap-y-2 px-3 mt-4">
        {songs.map((item)=> {return <MediaItem key={item.id} data={item} onClick={(id:string)=>onPlay(id)}/>})}
      </div>
    </div>
  );
};

export default Library;

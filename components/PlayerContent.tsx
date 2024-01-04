"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import * as RadixSlider from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();

  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [time, setTime] = useState({
    min: 0,
    sec: 0,
  });
  const [currTime, setCurrTime] = useState({
    min: 0,
    sec: 0,
  });

  const [seconds, setSeconds] = useState(0);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const seekSong = (newValue: number[]) => {
    sound.seek([newValue[0]]);
  };

  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);

    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }
    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);

    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }
    player.setId(previousSong);
  };

  const [play, { pause, duration, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"], //important without this it won't work
  });
  //since this hook does not work dynamically, have to re-render the component to change the songUrl and play the next/previous song

  useEffect(() => {
    if (duration) {
      const sec = duration / 1000;
      const min = Math.floor(sec / 60);
      const secRemain = Math.floor(sec % 60);
      setTime({
        min: min,
        sec: secRemain,
      });
    }
  }, [duration, isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]));
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    sound?.play();
    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) setVolume(1);
    else setVolume(0);
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start items-center">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      {/*mobile view*/}
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className={twMerge(`h-8 w-8 flex items-center justify-center rounded-full bg-white cursor-pointer`, isPlaying ? "" : "ps-0.5")}
        >
          <Icon size={25} className="text-black" />
        </div>
      </div>
      {/*desktop view*/}
      <div className="md:flex justify-center items-center flex-col">
        <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6 pb-2">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={20}
            className="text-neutral-400 cursor-pointer hover:text-white"
          />
          <div
            onClick={handlePlay}
            className={twMerge(`h-8 w-8 flex items-center justify-center rounded-full bg-white cursor-pointer`, isPlaying ? "" : "ps-0.5")}          >
            <Icon size={25} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={20}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>
        <div className=" hidden md:flex flex-row justify-center items-center w-full pb-2">
          <p className="flex px-1 text-xs text-neutral-400 w-[33px]">
            {currTime.min}:
            {currTime.sec >= 10 ? currTime.sec : `0${currTime.sec}`}
          </p>
          <div className="align-middle flex w-[500px]">
            {/* <input
              type="range"
              min="0"
              max={duration / 1000}
              value={seconds}
              className="h-1 w-[400px]"
              style={{borderColor:"none"}}
              onChange={(e) => {
                sound.seek([e.target.value]);
              }}
            /> */}
            <RadixSlider.Root
              className="relative flex items-center w-full cursor-pointer group"
              defaultValue={[0]}
              value={[seconds]}
              onValueChange={seekSong}
              max={duration / 1000}
              step={1 / 1000}
            >
              <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
                <RadixSlider.Range className="absolute bg-white rounded-full h-full group-hover:bg-emerald-500" />
              </RadixSlider.Track>
              <RadixSlider.Thumb className="hidden group-hover:block bg-white w-3 h-3 rounded-full"/>
            </RadixSlider.Root>
          </div>
          <p className="flex px-1 text-xs text-neutral-400">
            {time.min}:{time.sec >= 10 ? time.sec : `0${time.sec}`}
          </p>
        </div>
      </div>
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px] group">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer text-neutral-400 hover:text-neutral-100"
            size={25}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;

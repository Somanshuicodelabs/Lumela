//
// This example assumes you are importing mux-embed from npm
// View this code on codesandbox: https://codesandbox.io/s/mux-data-hls-js-react-ucvvh
//
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import mux from "mux-embed";

export default function ReactMuxPlayer({ settings }) {
  const { videos, type,width,height } = settings;
  const videoRef = useRef(null);
  const src = videos[0];
  useEffect(() => {
    let hls;
    if (videoRef.current) {
      const video = videoRef.current;
      const initTime = Date.now();

      if (src) {
        // This will run in safari, where HLS is supported natively
        video.src = src;
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }

      mux.monitor(video, {
        debug: false,
        // pass in the 'hls' instance and the 'Hls' constructor
        hlsjs: hls,
        Hls,
        data: {
          env_key: process.env.REACT_APP_MUX_VIDEO_ENV, // required
          // Metadata fields
          player_name: "Main Player", // any arbitrary string you want to use to identify this player
          player_init_time: initTime
          // ...
        }
      });

    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoRef]);

  const autoPlay = () => {
    videoRef && videoRef.current && videoRef.current.play().catch(error => console.log('Error attempting to play', error))
  }
  useEffect(() => {
    autoPlay()
  }, [])

  return (
    <video
      ref={videoRef}
      style={{ width, height }}
      playsInline
      // webkit-playsinline={true}
      muted
      loop
    />
  );
}
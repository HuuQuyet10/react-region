// ts

import React, {useEffect, useState} from 'react';
import YouTube, {YouTubeProps} from 'react-youtube';
import './style.scss';


interface PropsVideo extends YouTubeProps{
  height: number;
  width: number;
}


function ExampleVideo(props: PropsVideo) {

  const {height, width} = props;
  const [player, setPlayer] = useState<any>();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const onPlayerReady: PropsVideo['onReady'] = (event) => {
    const target = event.target;

    setPlayer(target);
    // access to player in all event handlers via event.target
    target.pauseVideo();
    target.hideVideoInfo();

  };

  const playPause = () => {
    if (!player) return
    if (player.getPlayerState() !== 1) {
      player.playVideo()
    } else {
      player.pauseVideo()
    }
  };

  const fullScreen = () => {
    let el = document.getElementById('yt_player');
    if (!document.fullscreenElement) {
      // !el!.requestFullscreen ? el!.webkitRequestFullScreen({navigationUI: 'hide'}) : el!.requestFullscreen({navigationUI: 'hide'})
      el!.requestFullscreen({navigationUI: 'hide'})
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };


  const ua = window.navigator.userAgent;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const fs = (ua.includes('iPhone;') && !ua.includes('iOS/')) ? 1 : 0;

  const opts: YouTubeProps['opts'] = {
    height: !isFullScreen ? height : windowHeight,
    width: !isFullScreen ? width : windowWidth,

    playerVars: {
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      autoplay: 0,
      // playsinline: 1,
      // controls: 0,
      fs,
      disablekb: 1,


      // showinfo: 0,
      // modestbranding: 1,
      // rel: 0,
      // autoplay: 1,
      // // playsinline: 1,
      // // controls: 0,
      // fs,
      // disablekb: 1,
    },
  };

  useEffect(() => {

    document.addEventListener('fullscreenchange', fullscreenChanged, false);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChanged);
    };
  }, []);

  function fullscreenChanged(event) {
    if (!document.fullscreen){
      setIsFullScreen(false);
    }
  }

  return <>
    <div id='yt_player' style={{height: `${height}px`, width: `${width}px`}}>
      <YouTube videoId="CsAtv8QYbx8" opts={opts} onReady={onPlayerReady} id={'youtubeIF'} />
      <div className='mask' onClick={() => playPause()} onDoubleClick={() => fullScreen()}></div>
      {!fs && <div className='controls'>
        <div className='btn' onClick={() => fullScreen()}>
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </div>
      </div>
      }
    </div>
    </>

  // return <>
  //   <iframe className='video'
  //           title='Youtube player'
  //           sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
  //           src={`https://youtube.com/embed/CsAtv8QYbx8?autoplay=0`}>
  //   </iframe>
  //   </>
}

export default ExampleVideo;
import React from 'react'
import './Video.css'
import PlayVideo from '../../components/PlayVideo/PlayVideo'
import Recommended from '../../components/Recommended/Recommended'
import { useParams } from 'react-router-dom'

const Video = () => {

const { categoryid, videoid } = useParams();

  return (
    <div className='play-container'>
      <PlayVideo  videoid={videoid}/>
      <Recommended categoryid={categoryid} />
    </div>
  )
}

export default Video
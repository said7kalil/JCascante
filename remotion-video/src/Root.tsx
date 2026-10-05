import {Composition} from 'remotion';
import {Viral} from './Viral';
import {FPS, TOTAL} from './shots';

export const Root = () => (
  <Composition id="Viral" component={Viral} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);

import * as _ from 'lodash'
import { ThreeEngine } from './libs/3ngine'
import TestSprite from './libs/TestSprite';
import Map from './components/map';

new ThreeEngine('container')
.addObject(new Map(500, 500))
.run();
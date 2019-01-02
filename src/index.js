import * as _ from 'lodash'
import { ThreeEngine } from './libs/3ngine'
import TestSprite from './libs/TestSprite';

new ThreeEngine('container')
.addObject(new TestSprite())
.run();
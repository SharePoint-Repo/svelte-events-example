import {useMachine} from 'svelte-robot-factory'; 
import machine from './eventMachine'; 
/*#if _PNPCONFIG
import {config} from '../config/$_PNPCONFIG'; 
//#else */
import {config} from './config'; 
//#endif
const service = useMachine(machine, config); 

export default service; 
import {useMachine} from '@kayodebristol/svelte-robot-factory'; 
import machine from './eventMachine'; 

const service = useMachine(machine); 

export default service; 
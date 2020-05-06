import { createMachine, state, transition, invoke, reduce } from 'robot3';
import {getData} from './getData';
import {config} from './config';

const context = () => ({
    data: [], 
    lists: config.lists,
    listNames: config.lists.map(list=>list.name),
    tabStatus: {}
    
}); 

async function retrieve(){
    return await getData(config)
}
const machine = createMachine({
	idle: state(
		transition('mount', 'loading')
	),
	loading: invoke(retrieve, 
		transition('done', 'display', 
            reduce((ctx, ev)=>{
                //console.log(ev);
                let s = {};
                for(let i = 0; i<ctx.lists.length; i++){

                    Object.defineProperty(s, ctx.lists[i].name, {value: ctx.lists[i].tabStatus, writable: false});
                }
                //console.log(s);
                return { ...ctx, data: ev.data, tabStatus: s}
            })
        )
    ), 
    display: state(
        transition('click', 'display',
            reduce((ctx, ev)=>{ 
                //console.log(ev);
                let l = ctx.lists.map(value=>{             
                    value.name == ev.data ? value.tabStatus = ' activeTab' : value.tabStatus = ' inactiveTab';
                    return value; 
                }); 
 
                let s = {};
                for(let i = 0; i<l.length; i++){

                    Object.defineProperty(s, l[i].name, {value: l[i].tabStatus,
                        writable: false});
                }
                console.log(s);

                return { ...ctx, lists: l, tabStatus: s}
            })
        )
    )
}, 
context);

export default machine; 
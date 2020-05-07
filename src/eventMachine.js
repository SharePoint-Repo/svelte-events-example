import { createMachine, state, transition, invoke, reduce, action } from 'robot3';
import {isSameDay, parseISO} from 'date-fns'; 
import {getData} from './getData';

const today = new Date(); 
const context = (config) => ({
    data: [], 
    lists: config.lists,
    listNames: config.lists.map(list=>list.name),
    tabStatus: {},
    config: config
    
}); 

const existsCount = function(data, ln, filterType){
    console.log(data); 
    console.log(ln); 
    console.log(filterType)

    let x = data.filter(e=> filterType(e, ln) ); 

    return (x.length)
}; 


const filterToday = function(e, ln){
    console.log(ln);
    if(ln == 'ALL EVENTS')
    {
        return (isSameDay(e.EventDate, today) == true);
    }
    else{
        return e.list == ln && isSameDay(e.EventDate, today) == true
    }
}; 




async function retrieve(ctx){
    
    console.log("Retrieve");
    console.log(ctx);
    let data = await getData(ctx.config);     
    return data; 
}
const machine = createMachine({
	idle: state(
        transition('mount', 'loading' 
               
        )
	),
	loading: invoke(retrieve,
        transition('done', 'display', 
            reduce((ctx, ev)=>{
                let lists = [...ctx.lists];
                let s = {};
                for(let i = 0; i<lists.length; i++){

                    Object.defineProperty(s, lists[i].name, {value: lists[i].tabStatus, writable: false});
                }
                
                lists = lists.map(list=>{                    
                    list.today = existsCount(ev.data, list.name, filterToday); 
                    list.total = existsCount(ev.data, listName, ()=>true)
                    return list; 
                }); 
                 
                //console.log(s);
                return { ...ctx, data: ev.data, tabStatus: s, lists: lists}
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
import { createMachine, state, transition, invoke, reduce, action } from 'robot3';
import {isSameDay, parseISO} from 'date-fns'; 
import {getData} from './getData';


const today = new Date(); 
const context = (config) => ({
    data: new Promise((resolve, reject)=>{setTimeout(()=>[],30000)}), 
    lists: config.lists,
    listNames: config.lists.map(list=>list.name),
    tabStatus: {},
    config: config
    
}); 
/*
const existsCount = function(data, ln, filterType){
    let x = data.filter(e=> filterType(e, ln)); 
    return (x.length)
}; 


const filterToday = function(e, ln){
    
    if(ln == 'ALL EVENTS')
    {
        return (isSameDay(e.EventDate, today) );
    }
    else{
        return e.list == ln && isSameDay(e.EventDate, today);
    }
}; 

const filterUpcoming = function(e, ln){
    
    if(ln == 'ALL EVENTS')
    {
        return true && !(isSameDay(e.EventDate, today));
    }
    else{
        return e.list == ln && !(isSameDay(e.EventDate, today));
    }
}; 
*/


async function retrieve(ctx){
    
    let data = await getData(ctx.config);     
    return data; 
}
const machine = createMachine({
	idle: state(
        transition('mount', 'loading', 
            reduce((ctx, ev)=>{
                let lists = [...ctx.lists];
                let s = {};
                for(let i = 0; i<lists.length; i++){

                    Object.defineProperty(s, lists[i].name, {value: lists[i].tabStatus, writable: true});
                    //Object.defineProperty(s, lists[i].name + '_today', {value: existsCount(ev.data, lists[i].name, filterToday), writable: false});
                    //Object.defineProperty(s, lists[i].name + '_upcoming', {value: existsCount(ev.data, lists[i].name, filterUpcoming), writable: false});
                }
                return { ...ctx,  tabStatus: s};
            }) 
               
        )
	),
	loading: invoke(retrieve,
        transition('done', 'display', 
            reduce((ctx, ev)=>{
                let lists = [...ctx.lists];
                let s = {};
                for(let i = 0; i<lists.length; i++){

                    Object.defineProperty(s, lists[i].name, {value: lists[i].tabStatus, writable: true});
                    //Object.defineProperty(s, lists[i].name + '_today', {value: existsCount(ev.data, lists[i].name, filterToday), writable: false});
                    //Object.defineProperty(s, lists[i].name + '_upcoming', {value: existsCount(ev.data, lists[i].name, filterUpcoming), writable: false});
                }
                return { ...ctx, data: ev.data, tabStatus: s};
            })
        )
    ), 
    display: state(
        transition('click', 'display',
            reduce((ctx, ev)=>{ 
                let l = ctx.lists.map(value=>{             
                    value.name == ev.data ? value.tabStatus = ' activeTab' : value.tabStatus = ' inactiveTab';
                    return value; 
                }); 
 
                let s = ctx.tabStatus;
                
                l.map(list=>{
                    s[list.name] = list.tabStatus; 
                }); 

                return { ...ctx, lists: l, tabStatus: s};
            })
        )
    )
}, 
context);

export default machine; 
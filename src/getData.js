import {isBefore, parseISO} from 'date-fns'
import {sp} from "@pnp/sp";


/*#if _SPVER == 2013 || 2016 
export let getData = async (config)=>{
    Logger.debug(config)
    sp.setup({
        sp: {
            ie11: true,
            defaultCachingStore: "local", // or "local"
            defaultCachingTimeoutSeconds: 360,
            globalCacheDisable: false, // or true to disable caching in case of debugging/testing
            headers: {
                Accept: "application/json;odata=verbose",
            },
            baseUrl: config.baseUrl 
        }
    });

    let items = [];
    const today = new Date().toISOString();
    for(let list of config.lists){
        await sp.web.lists.getByTitle(list)
        .items
        .filter('EventDate ge datetime' +"'" + today + "'")
        .orderBy("EventDate")
        .top(5)
        .get()
        .then(response => {
            Logger.debug(response);
            let temp = response.map(row => {
                row.list = list;
                row.linkUrl = (config.baseUrl) + "/lists/" + list + "/DispForm.aspx?ID=" + (row.ID); 
                return row; 
            });
                
            items = [...items,...temp];
        })
    }
    items.sort((a,b) => {
        if(moment(a.EventDate).isBefore(moment(b.EventDate))){return -1}
        return 1
    }) 
    Logger.debug(items);
    return items
}
//#elif _SPVER == 2019

//#else */
export const getData = async (config)=>{
    console.log(config); 
    sp.setup({
        sp: {
            ie11: true,
            defaultCachingStore: "local", // or "local"
            defaultCachingTimeoutSeconds: 360,
            globalCacheDisable: false, // or true to disable caching in case of debugging/testing
            headers: {
                Accept: "application/json;odata=verbose",
            },
            baseUrl: config.baseUrl 
        }
    });
    const overrideViewXml =  `
            <View>
                <QueryOptions>
                        <ExpandRecurrence>"TRUE"</ExpandRecurrence>
                        <RecurrenceOrderBy>"TRUE"</RecurrenceOrderBy>
                        <ViewAttributes Scope="RecursiveAll"/>
                </QueryOptions>
                <Orderby>
                    <FieldRef Name="EventDate"/>
                </Orderby>
                <Query>
                    <Where>
                        <DateRangesOverlap>
                            <FieldRef Name="EventDate"></FieldRef>
                            <FieldRef Name="EndDate"></FieldRef>
                            <FieldRef Name="RecurrenceID"></FieldRef>
                            <Value Type="DateTime">
                                <Now/>
                            </Value>
                        </DateRangesOverlap>
                    </Where>
                </Query>
            </View>
            `
    
    let items = [];
    
    for(let list of config.lists){
        if (list.name == 'ALL EVENTS'){continue;}
        await sp.web.lists.getByTitle(list.name)
        .renderListDataAsStream({

            OverrideViewXml: overrideViewXml,
            
            Paging:'Paged=TRUE&RowLimit=5'
        })
        .then(response => {
          
            let temp = response.Row.map(row => {
                row.list = list.name;
                row.linkUrl = (config.baseUrl) + "/list/" + (list.name) + "/DispForm.aspx?ID=" + (row.ID);
                row.EventDate = parseISO(row['EventDate.']); 
                row.EndDate = parseISO(row['EndDate.'])
                return row; 
            });
            
            items = [...items,...temp];
        })
    }
    items.sort((a,b) => {
        if( isBefore(parseISO(a.EventDate), parseISO(b.EventDate))){return -1}
        return 1
    }) 
  
    return items
}
//#endif
<script>
	import { isSameDay, format } from 'date-fns'
	import {sp} from "@pnp/sp";
	import {onMount} from 'svelte';
	import service from './store'; 
		
	const today = new Date();
	const send = $service.send;
	//const lists = $service.context.lists;
	const listNames = $service.context.listNames;
	$: data = $service.context.data;
	$: tabStatus = $service.context.tabStatus;
	$: state = $service.machine.current; 
	
    (window).global = window;
	if (global === undefined) {
   		var global = window;
	}		
	

	onMount(()=>{send('mount');});
</script>

<main>
	<div class='tab'>
		{#each (listNames) as listName}
			<button class='tabButton {tabStatus[listName]}' on:click|preventDefault={(event)=>send({type:'click', data: listName})}>{listName.replace('BLDG 3317 ', '')}</button>
		{/each}
	</div>
	{#each (listNames) as listName}
	
		<div class='tabContent {tabStatus[listName]}' id={listName}>

			{#await data}
				<p>...retreiving data</p>
			{:then data}
			
				<ul>Today's Events
					{#if tabStatus[listName + "_today"]}				
						{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration}}

							{#if isSameDay(EventDate, today) && list == listName}
								<li><a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate, "ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate, "HHmm)")} </span> <span class="title">- {Title}</span></div>					
								</a></li>
							{:else if isSameDay(EventDate, today) && listName == 'ALL EVENTS'}
								<li><a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate, "ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate, "HHmm)")} </span> <span class="title">- {list.replace('BLDG 3317 ', '') + " - " + Title}</span></div>					
								</a></li>
							{/if}
						{/each}
					{:else}
						<li>
							<div class="event">None</div>					
						</li>
					{/if}
					
				</ul>
				
				<ul>Upcoming Events
					{#if tabStatus[listName + "_upcoming"]}	
						{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration }}
							
							{#if !(isSameDay(EventDate, today)) && list == listName }
								<li><a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate,"ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate,"HHmm)")} </span> <span class="title">- {Title}</span></div>					
								</a></li>
							{:else if !(isSameDay(EventDate, today)) && listName == 'ALL EVENTS'}
								<li><a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate, "ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate, "HHmm)")} </span> <span class="title">- {list.replace('BLDG 3317 ', '') + " - " + Title}</span></div>					
								</a></li>

							{/if}
						{/each}
					{:else}
						<li>
							<div class="event">None</div>					
						</li>
					{/if}
				</ul>
			{:catch error }
				<p style="color: red">{error.message}</p>
			{/await}
		</div>
	{/each}
	{@debug $service}
</main>

<style>
	main {
		text-align: left;
		max-width: 240px;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
	}
	.tab {
		overflow: hidden;
		
	}
	.tab button {
		background-color: inherit;
		float: left;
		border: none;
		outline: none;
		cursor: pointer;
		padding: .5em;
		transition: 0.3s;
		margin: 0px;
		text-transform: uppercase;
		font-size: 15px;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; 
		font-weight: bold;
	}

	.tab button:hover {
	background-color: #ddd;
	}


	.tab .tabButton.activeTab  {
	background-color: #ddd;
	}

	.tabContent {
	display: none;
	padding:.25em;
	
	border-top: none;
	}
	.tabContent {
	animation: fadeEffect 1s; 
	}
	.tabContent.activeTab{
		display: block;
	}
	@keyframes fadeEffect {
	from {opacity: 0;}
	to {opacity: 1;}
	}

	.event{
		color:black;
		font-weight: 200; 
	}
	
	.title{
		font-weight: 400; 
	}
			
	li {
		list-style-type: none;
		font-size: 14px;
		
	}
	ul {
		font-weight: bold;
		font-size: 15px;
		margin-left: -35px;
		color: black;
	}
	a:hover{
		
		text-decoration: none;

	}
	a:hover .event{
		color: darkblue;

	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
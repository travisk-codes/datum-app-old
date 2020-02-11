# 📊 Datum
A personal metrics management platform: know yourself through data

## TODO
### import/export csv
1. long-press/right-click main button to open menu
	* long-press/right-click api
		- right click
			* disable rc menu on button
				- onConextMenu react event
		- long press
	* side dock menu
2. select import/export
	* import:
		- "are you sure you want current data erased?"
		- trigger browser api to select csv file
		- convert csv to datums
		- erase current and load new datums
	* export:
		- convert datums to csv
		- trigger browser api to download file

TODO if bar empty, button opens menu, else adds datum

## SCRATCH
### Habits View
- Story 1:
	1. open empty view
	2. click add habit
	3. toggle habit for today
	4. toggle habit for yesterday
	5. untoggle habit for today
	6. delete tag

OBJECT SHAPES:

datum = {
	id: uuid()
	time: unixTime
	tags: [
		{ name: a, value: b },
		{ name: c },
		{ name: d },
	]
}

||
\/

habit = {
	name: string
	relative_date: days from today?
}

||
\/

datum = {
	id: uuid()
	time: relativeDateToUnixTime(days_since_now)
	tags: [
		{ name: 'habit', value: habit.name }
	];
}



habits = {
	habit1: [0, 0, 1, 0, ...]
	habit2: ''
	...
}

onClickCheckbox:
- figure out date from position in array
- send: habit name, date, create/delete




### TIMELINE VIEW

start nap T
stop nap T+60
start med T+90


habits = [
	// encounter second item
	{
		name: 'nap',
		height: 60,
	},
	// encounter a stop, switch to white/empty
	{
		name: null,
		height: 60,
	},

]





* front-end web-app dev
* daily habit tracker
* React, Material-UI
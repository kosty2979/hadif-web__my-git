"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    '101': 'Internal	error.',
    '102': 'URL	is	missing.',
    '103': 'Template	is	empty	or	null.',
    '104': 'This	template	does	not	exist',
    '105': 'Session	error.',
    '106': 'General	Security	error.',
    '107': 'No	broadcast	type	or	media	type.',
    '108': 'No	channel.',
    '109': 'No	item.',
    '110': 'No	portal.',
    '111': 'No	EPG.',
    '112': 'Selected	template	has	no	output.',
    '113': 'Maximum	number	of	sessions	per	user	exceeded.',
    '114': 'Subscription	error.',
    '115': 'Not	enough	credit	error	(for	pay	per	view	billing	– not	implemented	yet).',
    '116': 'Geoip	blocking	error.',
    '118': 'Client	doesn’t	have	access	to	portal.',
    '119': 'Client	doesn’t	have	access	to	API	Call.',
    '120': 'Digest	error.',
    '121': 'Client	id	is	not	valid.',
    '122': 'Version does	not	exist.',
    '123': 'Username	Error.',
    '124': 'Password	is	not	valid.',
    '125': 'Email	is	not	valid.',
    '126': 'New	password	is	not	valid.',
    '127': 'User	id	error.',
    '128': 'Registration	code	is	not	correct.',
    '129': 'Email	was	not	sent.',
    '130': 'Client	doesn’t	have	access	to	channel.',
    '131': 'Password	has	not	changed.',
    '132': 'Cannot	create	user.',
    '133': 'Username	Already	Exist.',
    '134': 'Not	enough	money	on	wallet.',
    '135': 'Subscription	purchase	error.',
    '136': 'Api	Use	limit	error.',
    '137': 'User	not	activated.',
    '138': 'Database	error',
    '139': 'User	not	valid',
    '142': 'Values	are	not	numeric',
    '201': 'Call	type	wrong	or	missing.',
    '202': 'Type	is	missing.',
    '203': 'Username	or	Password	Wrong.',
    '204': 'Portal	id	is	missing.',
    '205': 'Extsessionid	is	missing.',
    '206': 'Itemid	is	missing.',
    '207': 'Bitrate	is	missing.',
    '208': 'Protocolid	is	missing.',
    '209': 'Channelid	is	missing.',
    '210': 'Itemid	,startdate,	starttime	or	duration are	missing.',
    '211': 'Token	is	missing.',
    '212': 'Ipaddress	is	missing.',
    '213': 'Token	client	is	missing.',
    '214': 'Permission	Issue.',
    '215': 'Token	client	and	portal	id	is	missing.',
    '216': 'Token	client	and	channel	id	is	missing.',
    '217': 'SessionsList	is	missing.',
    '218': 'Digest	is	missing.',
    '219': 'Client	is	missing.',
    '220': 'Version	is	missing.',
    '221': 'Username	is	missing.',
    '222': 'Password	is	missing.',
    '223': 'First	name	is	missing.',
    '224': 'Last	name	is	missing.',
    '225': 'Gender	is	missing.',
    '226': 'Professional	is	missing.',
    '227': 'Address	is	missing.',
    '228': 'Town	is	missing.',
    '229': 'Country	is	missing.',
    '230': 'County	is	missing.',
    '231': 'Postcode	is	missing.',
    '232': 'Company	name	is	missing.',
    '233': 'Phone	is	missing.',
    '234': 'Mobile	number	is	missing.',
    '235': 'new	password	is	missing.',
    '236': 'User	id	is	missing.',
    '237': 'Email	is	missing.',
    '238': 'Token	is	missing.',
    '239': 'Year	of	birth	is	missing.',
    '240': 'Transaction	type	error.',
    '241': 'Payment	gateway	error.',
    '242': 'invalid	voucher.',
    '243': 'Invalid	item	id.',
    '245': 'Sage	Pay	vendor	name	is	missing.',
    '246': 'Sage	Pay	vendor	name	is	invalid.',
    '247': 'Currency	is	missing.',
    '248': 'Currency	is	invalid.',
    '249': 'Cardholder	is	missing.',
    '250': 'Cardholder	is	invalid.',
    '251': 'Card	number	is	missing.',
    '252': 'Card	number	is	invalid.',
    '253': 'Expiry	month	is	missing.',
    '254': 'Expiry	month	is	invalid.',
    '255': 'Expiry	year	is	missing.',
    '256': 'Expiry	year	is	invalid.',
    '257': 'CV2	is	missing.',
    '258': 'CV2	is	invalid.',
    '259': 'Card	type	is	missing.',
    '260': 'Card	type	is	invalid.',
    '261': 'SagePay	Error.',
    '262': 'Billing	username	is	missing.',
    '263': 'Billing	address1	is	missing.',
    '264': 'Billing	city	is	missing.',
    '265': 'Billing	postcode	is	missing.',
    '266': 'Billing	country	is	missing.',
    '267': 'billing	state	is	missing.',
    '268': 'Card	id	is	missing.',
    '269': 'Card	Id	is	invalid.',
    '270': 'Transaction	id	is	missing.',
    '271': 'Amount	is	missing.',
    '272': 'Amount	is	invalid.',
    '273': 'Description	is	missing.',
    '274': 'Description	is	invalid.',
    '275': 'Billing	first	name	is	missing.',
    '276': 'Billing	country	is	invalid.',
    '278': 'Sage	Pay	required	3D	authentication.',
    '279': 'Transaction	id	is	invalid.',
    '280': 'User	is	already	subscribed.',
    '281': 'Invalid	minimum	date	',
    '282': 'invalid	maximum	date',
    '286': 'Channelid,startdate, starttime	or	duration	is	missing.',
    '287': 'Portalid,stardate,starttime	or	duration	is	missing.',
    '288': 'Rate	is	missing',
    '294': 'Searchstring	is	missing',
    '295': 'Range	is	invalid.',
    '296': 'Level	is	missing.',
    '297': 'Itemtype	is	invalid.',
    '299': 'Voucher	is	missing',
    '300': 'Voucher	expired',
    '304': 'No	Voucher',
    '307': 'SeasonId	is	missing',
    '308': 'Seriesid	is	missing',
    '309': 'Rate	is	invalid.',
    '310': 'Itemtype	is	invalid',
    '311': 'Voucher	redeemed',
    '312': 'Voucher	claimed',
    '313': 'Voucher	redeemed	by	someone	else',
    '314': 'Voucher	claimed	by	someone	else',
    '315': 'Voucher	used	by	more	than	once',
    '316': 'More	than	one	voucher	exist.',
    '330': 'Autorenew not available on this transaction type'
};
//# sourceMappingURL=api-errors.js.map
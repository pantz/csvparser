var csv = require('csv');
var fs = require('fs');
var moment = require('moment');

var out = 'Subject, Start Date, End Date, Description\r\n';

csv()
.from('dockets.csv', { columns:true} )
.transform(function(row){
	var rowArr = [];
	var Subject = row.Docket + ' - '+row.Customer;
	var StartDate = row['Start Date'];
	var EndDate = row['End Date'];
	var Description = row['Description'];

	if(StartDate){
		StartDate = StartDate.split('-');
		SDate = StartDate[0]+'-'+StartDate[1]+'-'+StartDate[2];
		SDate = moment(SDate,'D-MMM-YY');
	}

	if(EndDate && EndDate !== ''){
		EndDate = EndDate.split('-');
		EDate = EndDate[0]+'-'+EndDate[1]+'-'+EndDate[2];
		EDate = moment(EDate,'D-MMM-YY');
	}

	if(Description && Description !== ''){
		Description = Description.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
	} else {
		Description = 'N/A';
	}

	//Add to array
	rowArr.push(Subject);
	rowArr.push(EDate.format('L'));
	rowArr.push(EDate.format('L'));
	rowArr.push(Description);

	if(EndDate && EndDate !== '' && EDate.isValid()){
		out += rowArr.join(',')+'\r\n';
		console.log(EDate._i);
	}

	return row;
})
.on('end', function(){
	fs.writeFile('dockets.parsed.csv', out, function(err){
		if(err) console.log(err);
		else console.log('Done');
	});
});
$(document).ready(function(){

  var dataWeekly = [];
  var dataMonthly = [];
  var dataQuarterly = [];
  var dataYearly = [];

  var sum = 0;


  function getPrice (){
    $.ajax({
      type: 'GET',
      url: "https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB",
      dataType: 'JSON',

      success: function(response){
        console.log('success!');  
        console.log(response.data); 

        $(response.data).each(function(){
          var data = {};
          data.y = this[1],
          data.x = convertDate(this[0]),
          dataWeekly.push(data);
        });
        // console.log(dataWeekly);
        
        for (var i=0; i< dataWeekly.length; i++) {
          getAverage(dataMonthly, 4,i);
          getAverage(dataQuarterly, 12, i);
          getAverage(dataYearly, 52, i);
        }

        // initiate chart
        plotHighChart();
      },

      error: function(){
        console.log("Error");
      }
    })
  }

  getPrice();

  // get moving average function
  var getAverage = function(data, weeks, i){
    if(i < dataWeekly.length - weeks){
      for(var j=0; j < weeks; j++){
        sum += dataWeekly[i+j].y;
      }
      data.push({x:dataWeekly[i].x, y:sum/ weeks})
      sum = 0;
    }
  }


  //Convert the string date to unix time 
  var convertDate =  function(helloKitty){
    var date = new Date(helloKitty);
    // console.log(date);
    return date.getTime(); 
  }

  // Start to plot the chart
  var plotHighChart = function(){
    $('#chart').highcharts({
      title:{
        text: 'Historical Gasoline Prices'
      },
      subtitle:{
        text: 'brought you by Bureau of Transportation Statistics'
      },
      xAxis:{
        // configurations of x-Axis
        type: 'datetime'
        // dateTimeLabelFormats:{
        // millisecond: '%H:%M:%S.%L',
        // second: '%H:%M:%S',
        // minute: '%H:%M',
        // hour: '%H:%M',
        // day: '%e. %b',
        // week: '%e. %b',
        // month: '%b \'%y',
        // year: '%Y'
        // }
      },
      yAxis:{
        // configurations of x-Axis
        min: 0,
        max: 5,
        title: {
          text:'Dollar per Gallon in USD'
        }
      },
      legend:{
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series:[{
        name: 'Weekly',
        data: dataWeekly,
      },{
        name: 'Monthly',
        data: dataMonthly,
      },{
        name: 'Quartly',
        data: dataQuarterly,
      },{
        name: 'Yearly',
        data: dataYearly,
      }],

    })
  }


// Closing ready 
})
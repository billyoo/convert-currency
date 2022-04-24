const express = require('express');
const path = require('path');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000

const agent = new https.Agent({  
	rejectUnauthorized: false
  });


  const  toFixed = (x) => {
	if (Math.abs(x) < 1.0) {
	  let e = parseInt(x.toString().split('e-')[1]);
	  if (e) {
		  x *= Math.pow(10,e-1);
		  x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
	  }
	} else {
	  let e = parseInt(x.toString().split('+')[1]);
	  if (e > 20) {
		  e -= 20;
		  x /= Math.pow(10,e);
		  x += (new Array(e+1)).join('0');
	  }
	}
	return x;
  }

 const convertDec =  (x)  => {
	n = 4
	x = toFixed(x) 

	// From here on the code is the same than the original answer
	const v = (typeof x === 'string' ? x : x.toString()).split('.');
	if (n <= 0) return v[0];
	let f = v[1] || '';
	if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
	while (f.length < n) f += '0';
	return `${v[0]}.${f}`
  }

// setting a view engine
app.set('view engine', 'ejs');

// setting templates directory
app.set('views', path.join(__dirname, 'views'));

// setting a public static server
app.use(express.static(path.join(__dirname, '/public')));

var list1 = [];
var amount_ = 0;
let d = "";

app.get('/', async (request, response) => {
	list1 = [];
	response.render('home', {	
		amount_: amount_,
		list1:[]
	});
});

app.get('/convert', (request, response) => {
	let { cfrom, cto,amount } = request.query;	
	try {       
        axios.get('https://open.er-api.com/v6/latest/'+cfrom, { httpsAgent: agent })
		.then(res => {
				if (res) {
				  jd = res.data.rates;
				  amount_ = amount * res.data.rates[cto];
				  amount_ = convertDec(amount_);
				  console.log('value   ' + res.data.rates[cto] +  "  " + amount_) ;				  
                 d = " . " + amount + " " + cfrom + " = " + amount_ +" "+ cto;
				 console.log("d "  + d)
				 amount = 0;
				 cfrom = 0;
				 cto = 0;
			

				 if(list1.length < 5){
					list1.push(d);
				 }else if (list1.length === 5){
					list1[0] = d;
				 }else{
					 list1 = list1
				 }
				 d = "";

				  response.render('home', {					  
					  error: false,
					  amount_:amount_,
					  list1:list1			  
				  });
				  amount_ = 0;
				}
			  })
			  .catch(error => {
				console.log(error)
			  })
    } catch (error) {
        if(error.response){
            console.log(error)
        }

    }

	
});



app.listen(PORT, err => {
	if (err !== undefined) {
		console.log('error occurred: ', err);
		return
	}

	console.log('currency converter listened by http://localhost:3000');
});






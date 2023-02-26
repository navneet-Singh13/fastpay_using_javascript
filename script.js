'use strict';
// Data
const account1 = {
  owner: 'Jasneet Singh',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Mahinder Singh',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30,1000000],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Navneet Singh',
  movements: [200, -200, 340, -300, -20, 50, 400, -460,100000],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Avinash Kaur',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
const displayMovements = function(acc, sort = false ){ 
  containerMovements.innerHTML ='' ; 
  const movs  = sort ? acc.movements.slice().sort((a , b ) => a - b ) : acc.movements ;

  movs.forEach( function ( mov , i ) { 
         const type = mov > 0 ? 'deposit': 'withdrawal' ;
         const html = `
         <div class="movements__row">
         <div class="movements__type movements__type--${type}">  ${type}</div>
         <div class="movements__value">${mov}</div>
       </div>` ; 

       containerMovements.insertAdjacentHTML('afterbegin' , html)  ;  
     }) ;  
     
    
    } 

const createUsernames = function (accs){ 
    accs.forEach(function (acc){ 
         acc.username = acc.owner.toLowerCase( ).split(' ').map( word => word.at(0) ).join('') ; 
    }) ;  
}
createUsernames(accounts) ; 

 let timer ; 
const calcDisplayBalance = function (acc) { 
    acc.balance = acc.movements.reduce(function (accu , curr, i , arr ){ 
        return accu + curr  ; 
    } )
    
      labelBalance.textContent  = `${ acc.balance} EUR ` ; 
}
const calcDepositAmount= function (account) {
    const deposit = account.movements.filter(mov => mov > 0 ).reduce((accu , curr ) => accu + curr ) ; 
  labelSumIn.innerHTML= deposit ; 
}
const calcwithdrawalAmount= function (account) {
  const withdrawal = account.movements.filter(mov => mov < 0 ).reduce((accu , curr ) => accu + curr ) ; 
labelSumOut.innerHTML= Math.abs( withdrawal )  ; 
}

btnLogin.addEventListener('click' ,function (e){ 
  e.preventDefault( ) ;
 const curracc =  accounts.find( acc => acc.username === inputLoginUsername.value.trim( ))
  if (curracc &&  curracc.pin === Number(inputLoginPin.value)  ) { 
     containerApp.style.opacity = 1 ;
     labelWelcome.textContent = `Welcome back ${ curracc.owner.split(' ').at(0) }` ; 
    
     updateUI(curracc) ; 


    if ( timer ) clearInterval( timer  ) ; 
   timer =  startLogOutTimer( ) ; 
    

  
  }
 
    
})
const startLogOutTimer = function ( )  {
  let time = 300 ; 
  const tick = function ( ) {
        const min = String(Math.trunc( time / 60 )).padStart(2, 0) ;    ; 
        const sec = String ( time % 60 ).padStart( 2, 0 ) ; 
        
       labelTimer.textContent =  `${min}:${sec}`   ;
       if(time === 0 ) { 
        clearTimeout(tick ) ; 
        containerApp.style.opacity = 0  ;
        labelWelcome.textContent = 'Login To get started :) ' ; 
     }
       time-- ;    
       
  };
   tick ( ) ; 
   const timer = setInterval( tick , 1000 ) ; 
   return timer ; 
  

}
const updateUI= function (curracc) { 
    
  displayMovements(curracc ); 
  calcDisplayBalance( curracc ) ; 
   calcwithdrawalAmount ( curracc ) ; 
    calcDepositAmount ( curracc); 
    displayDate( ) ; 
 }
btnTransfer.addEventListener('click' , function (e){ 
  e.preventDefault() ; 

  const curracc =  accounts.find( acc => acc.username === inputLoginUsername.value.trim( )) ; 

  const amount = Number(inputTransferAmount.value) ; 
  const recAcc = accounts.find( acc => acc.username === inputTransferTo.value ); 
 
  if (recAcc &&  amount>0 && curracc.balance > 0 && curracc.username != recAcc.username && amount <= curracc.balance  ){ 
     
    console.log( "valid ") ;  
     
      curracc.movements.push(-amount ) ; 
      recAcc.movements.push(amount) ; 
      updateUI(recAcc) ; 
      updateUI(curracc) ; 
      // reset Timer 
      
   }
   clearInterval( timer ) ; 
      timer = startLogOutTimer( ) ; 
} )
btnLoan.addEventListener ('click' , function ( e ){ 
   e.preventDefault( ) ; 
   const loanAmt = inputLoanAmount.value ; 
   const curracc =  accounts.find( acc => acc.username === inputLoginUsername.value.trim( )) ;
   if ( loanAmt <= 100000 && loanAmt > 0 ) { 
    curracc.movements.push( Number(loanAmt) )  ; 
   }
   updateUI(curracc) ; 
   
   
   clearInterval( timer ); 
   timer = startLogOutTimer( ); 

} )
btnClose.addEventListener( 'click' , function ( e ) { 
  
  e.preventDefault( ) ; 
  const curracc =  accounts.find( acc => acc.username === inputLoginUsername.value.trim( )) ;
  if ( inputCloseUsername.value === curracc.username && Number(inputClosePin.value )=== curracc.pin ){ 
    const  idx =  accounts.findIndex(function ( acc ){ 
       return acc === curracc ; 
    }) ; 
     accounts.splice( idx , 1 ) ;
     containerApp.style.opacity = 0 ;

  } 
  clearInterval( timer ); 
   timer = startLogOutTimer( ); 
  inputCloseUsername.value = inputClosePin = ''; 
}) 
let sortedstate = false ;  
btnSort.addEventListener('click' , function (e)  {
     e.preventDefault( ) ; 
     const curracc =  accounts.find( acc => acc.username === inputLoginUsername.value.trim( )) ;
     displayMovements( curracc , !sortedstate ) ;
     sortedstate = !sortedstate ;  
     clearInterval( timer ); 
     timer = startLogOutTimer( ); 
 })
   // displaying the today's date 
 const displayDate = function ( )  { 
  const now  = new Date () ; 
   
  // day/month/year 
  const day  = `${now.getDay( ) }`.padStart(2 , 0 ) ; 
     
  const month = `${now.getMonth( ) +1 }`.padStart( 2 , 0 ) ; 
  const year = now.getFullYear( ); 
  const hours = now.getHours( ); 
  const min = now.getMinutes( ); 
  const dstring = `${day}/${month}/${year} , ${hours}:${min}` ; 
   
  labelDate.innerHTML = dstring  ; 
  } 
    
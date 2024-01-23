const dropdownMenu=document.getElementById('dropdown-menu');
const lastPrice=document.getElementById('last-price');
const buysellPrice=document.getElementById('buy-sell');
const difference=document.getElementById('difference');
const saving=document.getElementById('savings');
const coinField=document.getElementById('coin-field');
const buyBtn=document.getElementById('buy-btn');
const bestBuy=document.getElementById('best-buy');

fetch('http://localhost:5000/api/v1/coins')
.then(res=>res.json())
.then(data=>{
    data.forEach(name=>{
        const child=document.createElement("a");
        child.textContent=name;
        child.classList.add("dropdown-item");
        child.id=name;
        dropdownMenu.appendChild(child);

        child.addEventListener("click", dropDownClick);
    })
}).catch(err=>console.error("Error in Fetching Coins",err));

const dropDownClick=(e)=>{
    console.log("clicked",e.target.id);
    const coinName=e.target.id;
    coinField.innerHTML=coinName;
    buyBtn.innerHTML=`BUY ${coinName}`;
    fetch(`http://localhost:5000/api/v1/search/${coinName}`)
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        const priceDifference = data.last - data.open;
        const savings= (priceDifference/data.open)*100;

        if(priceDifference<0 && savings<0){
            saving.classList.add('loss');
            difference.classList.add('loss');
        }
        else{
            saving.classList.remove('loss');
            saving.classList.add('gain');
            difference.classList.remove('loss');
            difference.classList.add('gain');
        } 

        bestBuy.innerHTML=`₹ ${data.sell.toLocaleString('en-IN', {style:'decimal'})}`;
        saving.innerHTML=`₹ ${priceDifference.toLocaleString('en-IN', {style:'decimal'})}`;
        difference.innerHTML=`${savings.toLocaleString('en-IN', {style:'decimal'})} %`;
        lastPrice.innerHTML=`₹ ${data.last.toLocaleString('en-IN', {style:'decimal'})}`;
        buysellPrice.innerHTML=`₹ ${data.buy.toLocaleString('en-IN', {style:'decimal'})} / ₹ ${data.sell.toLocaleString('en-IN', {style:'decimal'})}`
    })
    .catch(err=>console.error("Error in Fetching Coin Data",err));
}


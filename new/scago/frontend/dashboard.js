import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALf0kWiEBWKBUHOCWOLwwbshc8678CQ_M",
  authDomain: "sass-66c7f.firebaseapp.com",
  projectId: "sass-66c7f",
  storageBucket: "sass-66c7f.appspot.com",
  messagingSenderId: "485007199733",
  appId: "1:485007199733:web:dbf3c7c8a05f6ab03324bc",
  measurementId: "G-HS4N83RJ1P"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const video = document.getElementById('video');
const barcodeInput = document.getElementById('barcodeResult');
const addbtn = document.getElementById('addbtn');
const submitbtn = document.getElementById('submitbtn');
const totalDiv1 = document.getElementById('totalDiv1');
const totalDiv2 = document.getElementById('totalDiv2');
const list = document.querySelector('.list');
const submitDiv = document.querySelector('.submissionAvailable');

let total = 0;
let index = 1;
let receipt = [];

// Start camera and barcode scanning
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      initBarcodeScanner();
    })
    .catch(err => {
      console.error('Error accessing the camera:', err);
    });
}

// Initialize QuaggaJS for barcode scanning
function initBarcodeScanner() {
  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: video,
      constraints: {
        width: { min: 640 },
        height: { min: 480 },
        aspectRatio: { min: 1, max: 100 },
        facingMode: 'environment'
      },
    },
    decoder: {
      readers: ['ean_reader', 'upc_reader', 'code_128_reader'],
    },
  }, err => {
    if (err) {
      console.error('Error initializing Quagga:', err);
      return;
    }
    Quagga.start();
    Quagga.onDetected(handleBarcodeDetection);
  });
}

// Function to handle detected barcode
function handleBarcodeDetection(result) {
  const code = result.codeResult.code;
  barcodeInput.value = code; // Display barcode in the input field
}

// Add item to cart by checking if it exists in 'items' collection
const addHandler = async () => {
  const productId = barcodeInput.value;
  const productRef = doc(db, 'items', productId);

  try {
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const productData = productDoc.data();
      const { name, price } = productData;
      const quantity = 1;

      // Add item to receipt array
      receipt.push({ name, price, quantity });
      total += price;
      updateTotal();

      // Display item in the list
      const newDiv = document.createElement('div');
      newDiv.className = 'item';

      const srDiv = document.createElement('div');
      srDiv.textContent = index++;
      srDiv.className = 'srdiv';

      const nameDiv = document.createElement('div');
      nameDiv.textContent = name;
      nameDiv.className = 'namediv';

      // Quantity adjustment controls
      const quantityDiv = document.createElement('div');
      quantityDiv.className = 'quantitydiv';

      const minusButton = document.createElement('button');
      minusButton.textContent = '-';
      minusButton.className = 'quantityBtn';
      minusButton.onclick = () => adjustQuantity(newDiv, -1);

      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.value = quantity;
      quantityInput.className = 'quantityInput';
      quantityInput.readOnly = true;

      const plusButton = document.createElement('button');
      plusButton.textContent = '+';
      plusButton.className = 'quantityBtn';
      plusButton.onclick = () => adjustQuantity(newDiv, 1);

      quantityDiv.appendChild(minusButton);
      quantityDiv.appendChild(quantityInput);
      quantityDiv.appendChild(plusButton);

      const priceDiv = document.createElement('div');
      priceDiv.textContent = price;
      priceDiv.className = 'pricediv';

      newDiv.appendChild(srDiv);
      newDiv.appendChild(nameDiv);
      newDiv.appendChild(quantityDiv);
      newDiv.appendChild(priceDiv);

      list.appendChild(newDiv);

      // Display submission option if total is positive
      submitDiv.style.display = total > 0 ? 'inline' : 'none';
    } else {
      alert('Product not found in database.');
    }

  } catch (err) {
    console.error('Error fetching product:', err);
  }
};

// Adjust quantity of an item in the cart
function adjustQuantity(itemDiv, delta) {
  const quantityInput = itemDiv.querySelector('.quantityInput');
  const priceDiv = itemDiv.querySelector('.pricediv');
  const itemName = itemDiv.querySelector('.namediv').textContent;

  let item = receipt.find(i => i.name === itemName);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;

  quantityInput.value = item.quantity;
  priceDiv.textContent = item.price * item.quantity;

  total = receipt.reduce((sum, i) => sum + i.price * i.quantity, 0);
  updateTotal();
}

// Update total display
function updateTotal() {
  totalDiv1.textContent = total;
  totalDiv2.textContent = total;
}

// Submit order to Firestore
submitbtn.addEventListener('click', async () => {
  if (total <= 0) {
    alert('Cannot submit with zero amount.');
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "receipts"), {
      items: receipt,
      total: total,
      username: 'customer', // Use dynamic username as needed
      date: new Date().toISOString() // Add order date
    });

    alert('Order submitted successfully!');
    
    // Reset form after submission
    barcodeInput.value = '';
    receipt = [];
    total = 0;
    index = 1;
    list.innerHTML = '';
    updateTotal();
    submitDiv.style.display = 'none';
  } catch (err) {
    console.error('Error submitting order:', err);
  }
});

addbtn.addEventListener('click', addHandler);

// Start the camera when the page loads
window.onload = startCamera;

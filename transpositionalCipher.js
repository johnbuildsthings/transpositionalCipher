#!/usr/bin/node

var fs = require('fs');

// input:     key and message
// output:    cipher text

// ecryption process:

//   break message into chunks of key length
//   arrange each chunk in order of the keys alphanumeric positioning
//   join chunks together and return

var encryptSort = function(elements, key){
  var temp = {}, sorted = '';
  var key = key.toString();

  for(var i=0; i<elements.length; i++){
    if(temp.hasOwnProperty(key[i])){
      temp[key[i]].push(elements[i]);
    }else{
      temp[key[i]] = [elements[i]];
    }
  }

  var newKey = Object.keys(temp).sort(function(a,b){return a > b});

  for(var i=0; i<newKey.length; i++){
    sorted += temp[newKey[i]].join('');
  }

  return sorted;
}

var decryptSort = function(elements, key){
  var temp = {}, sorted = '';
  key = key.toString().slice(0, elements.length);

  var newKey = key.split('').sort(function(a,b){return a > b});

  for(var i=0; i<elements.length; i++){
    if(temp.hasOwnProperty(newKey[i])){
      temp[newKey[i]].push(elements[i]);
    }else{
      temp[newKey[i]] = [elements[i]];
    }
  }

  for(var i=0; i<key.length; i++){
    sorted += temp[key[i]].shift();
  }

  return sorted;
}

var encrypt = function(key, message, direction){
  key = key.toString();

  var chunks = message.match(new RegExp('.{1,'+key.length+'}',"g"));
  var cipherText = '';

  for(var i=0; i<chunks.length; i++){
    var elements = chunks[i].split('');
    cipherText += (direction === 'encrypt') ? encryptSort(elements, key) : decryptSort(elements, key);
  }

  return cipherText;
}

var writeToFile = function(key, direction, origin, dest){
  var data = encrypt(key, origin, direction);

  if(dest){
    fs.appendFile(dest, data, encoding='utf8', function(err){
      if(err) console.log('error when writing to file', err);
    })
  }else{
    console.log(data)
  }
}

var main = function(){
  var args = process.argv.slice(2, process.argv.length);
  if(args[0] === 'help'){
    console.log("Call format: ./transpositionalCipher.js key encrypt/decrypt file/message destination/none\
      \n\nmessage file and destination must be absolute paths\
      \nif no destination is given message will print to stdout");
    return true;
  }
  if (args[2].match(/^\//g)){
    // read file
    fs.readFile(args[2], 'utf8', function(err, data){
      writeToFile(args[0], args[1], data, args[3] || null);
    })
  }else{
    writeToFile(args[0], args[1], args[2], args[3] || null);
  }
}

main();

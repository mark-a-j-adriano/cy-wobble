#! /usr/bin/env node


//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const _ = require('underscore');

console.clear();
// demand an array of keys to be provided
let { argv } = require('yargs/yargs')(process.argv.slice(2))
  .option('slice', {
    alias: 's',
    describe: 'Convert list into array'
  })
  .option('index', {
    alias: 'i',
    describe: 'provide the index to return'
  })
  .demandOption(['slice', 'index'], 'Please provide both slice and index arguments to work with this tool')
  .help()
  .argv;


console.log(argv);


const folderPath = './runner-results/';
//joining path of directory

let listFiles = [];
let duration = 0;

//passsing directoryPath and callback function
fs.readdir(folderPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        const filePath = path.join(folderPath, file);
        const data = fs.readFileSync(filePath);
        const obj = JSON.parse(data);

        const temp = obj.file.split("/");

        let entry = {name:temp[2], duration: obj.duration};

        duration = duration + obj.duration;
        listFiles.push(entry);
    });

    if(listFiles.length > 0){
        const temp = _.sortBy(listFiles, 'duration');
        const mod = listFiles.length % 2;
        let max = 0;
        if(mod > 0){
            max = (temp.length+1) / 2;
        }else{
            max = temp.length / 2;
        }
        const uplimit = temp.length - 1;

        let newList = [];
        for (let i = 0; i < max; i++) {
            const slice1 = temp[i];
            if(slice1){
                newList.push(slice1);
            }

            const slice2 = temp[uplimit - i];
            if(slice2 && slice1!==slice2){
                newList.push(slice2);
            }
        }
        console.log('newList', max, newList.length, newList);
    }

});

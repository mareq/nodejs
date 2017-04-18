#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_buffers.htm


console.log("== Reading from Buffers ==");
{
  var buf = new Buffer(26);
  for(var i = 0; i < 26; i++) {
    buf[i] = i + 97;
  }

  console.log(buf.toString('ascii'));          // outputs: abcdefghijklmnopqrstuvwxyz
  console.log(buf.toString('ascii', 0, 5));    // outputs: abcde
  console.log(buf.toString('utf8', 0, 5));     // outputs: abcde
  console.log(buf.toString(undefined, 0, 5));  // encoding defaults to 'utf8', outputs abcde
}

console.log("== Convert Buffer to JSON ==");
{
  var buf = new Buffer('Simply Easy Learning');
  var json = buf.toJSON(buf);

  console.log(json);
}


console.log("== Concatenate Buffers ==");
{
  var buffer1 = new Buffer('TutorialsPoint ');
  var buffer2 = new Buffer('Simply Easy Learning');
  var buffer3 = Buffer.concat([buffer1,buffer2]);

  console.log("buffer3 content: " + buffer3.toString());
}

// http://stackoverflow.com/a/31007936
// This functionality has been added in v0.12, not present in v0.10.29
//console.log("== Compare Buffers ==");
//{
  //var buffer1 = new Buffer('ABC');
  //var buffer2 = new Buffer('ABCD');
  ////var result = buffer1.compare(buffer2);
  //var result = Buffer.compare(buffer1, buffer2);

  //if(result < 0) {
    //console.log(buffer1 + " comes before " + buffer2);
  //}
  //else if(result == 0) {
    //console.log(buffer1 + " is same as " + buffer2);
  //}
  //else {
    //console.log(buffer1 + " comes after " + buffer2);
  //}
//}

console.log("== Copy Buffer ==");
{
  var buffer1 = new Buffer('ABC');

  //copy a buffer
  var buffer2 = new Buffer(3);
  buffer1.copy(buffer2);

  console.log("buffer2 content: " + buffer2.toString());
}

console.log("== Slice Buffer ==");
{
  var buffer1 = new Buffer('TutorialsPoint');

  //slicing a buffer
  var buffer2 = buffer1.slice(0,9);

  console.log("buffer2 content: " + buffer2.toString());
}

console.log("== Buffer Length ==");
{
  var buffer = new Buffer('TutorialsPoint');

  //length of the buffer
  console.log("buffer length: " + buffer.length);

  //byte length of a string
  var str = 'Ľúbozvučná Slovenčina :)';
  console.log("UTF-8 string byte length (default): " + Buffer.byteLength(str));
  console.log("UTF-8 string byte length (ascii): " + Buffer.byteLength(str, 'ascii'));
  console.log("UTF-8 string byte length (utf-8): " + Buffer.byteLength(str, 'utf8'));
}



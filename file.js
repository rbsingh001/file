const http = require('http');
const fs = require('fs');
const { buffer } = require('stream/consumers');
const { clear } = require('console');
var msg;
const server  = http.createServer(( req, res )=>{
    
    const method = req.method;
    const url = req.url;

    if(url ==='/'){
        fs.readFile('message.txt',(err, data)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(data);
            msg = data;
            

            res.write('<html>')
            res.write('<head>Enter Message</head>')
            res.write(`<body><p>${msg}</p><form action= "/message" method="POST"><input type="text" name="message"><button type="submit">send</button></form></body>`)
            res.write('</html>')
            return res.end();
        
        
        });
        
    }

    if(url === '/message' && method ==='POST'){
        const body = [];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);

        });
        return req.on( 'end', ()=>{
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1]
            fs.writeFile('message.txt', message , (err) =>{
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        })
    }
    

    
});

server.listen(4000);
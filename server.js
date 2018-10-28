const express = require('express');
const server = express();
const bodyparser = require('body-parser');
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({extended: false}));

var urls = [];
var pass = '55555555';

setInterval(newPass = () =>{
    
    const max = 4294967295;
    const min = 268435456;
    pass = Math.floor(Math.random() * (max - min) + min).toString(16);
    console.log(pass);
}, 10000);

validateProtocol = (url) =>{
    let check = url.split('://');

    if(check[0] == 'https'){
        return 'https';
    }else{
        return 'http';
    }
}

encurtaUrl = () => {
    let ultimo = urls.length;
 
    let tam = (1000000+ultimo).toString(16);

    if(tam.length < 6){
       tam = '0'.concat(tam);
    }

    return tam;
}

function stringLink(urlParam){
    let url = {
        urlOrigin: urlParam.split('://').pop(),
        urlEncurtada: encurtaUrl(),
        checkin: Date.now(),
        type: validateProtocol(urlParam)
    };
    
    urls.push(url);

    return url;
}


server.get('/short', function(req, res){
    let url = req.query.url;

    if(url){
        res.send(stringLink(url));
    }else{
        res.send({error: 'Url não informada!'});
    }
});

server.get('/:url', function(req, res){
    let index = urls.findIndex(function(u) {
        return u.urlEncurtada == req.params.url;
    });
    let url = urls[index];

    if(url && (Date.now() - url.checkin) < 432000000){
        //res.send(url);
        res.redirect(url.type.concat('://', url.urlOrigin));
    }else{
        res.send({error: 'Url não encontrada!'});
    }
});

server.post('/', function(req, res){
    let senha = req.body.password;
    console.log(req.body);
    if(senha == pass){
        res.send({urls})
    }else{
        res.send({error: 'Senha inválida'});
    }
})

server.listen(3000, console.log('Server iniciado na porta 3000'));
const twit = require('twit');
const config = require('./config');
const Tweet = new twit(config);
var stream = Tweet.stream('statuses/filter', { track: '@<DevsOnline>' });
// Colocar a função do bot para ser um evento: CHECK
// Para cada Tweet com #DevsOnline ++ Vídeo/Medium/Foto deve ser Retweeted
// Seguir de volta quem seguir (mandar direct com mensagem para seguir a conta principal)
// Cada menção/chamada deve curtir
// Tweetar a cada X horas alguma afiliado quando tiver com muitos seguidores

// Criar outros bots com o mesmo princípio, mas para outras áreas (Música, Filmes, Nerd, Futebol, Youtubers)


function retweetSearch(){
    let params={
        q:'#DevsOnline',
        result_type: 'recent',
        count: 1
    }
    Tweet.get('search/tweets',params,(err,data,response) => {
        let tweets = data.statuses;
        if(!err){
            for(let dat of tweets){
                let retweetId=dat.id_str;
                console.log(dat.text_str);
                Tweet.post('statuses/retweet/:id', {id:retweetId},(err,responde)=>{
                    if(response){
                        console.log('Retweeted!!!!' + retweetId);
                    }
                    if(err){
                        console.log('Ooops Something went wrong');
                    }
                })
            }
        }
    });
}

function directMsg(toWhom){
    console.log('Followed entrou');
    msgTxt = 'Muito obrigado,' + '@' + toWhom + 'por ter me seguido, use sempre a #DevsOnline para compartilhar com toda a comunidade seus vídeos, posts e podcasts para crescer com toda a comunidade Dev. Por favor, não se esqueça de seguir o meu criador @AmanhaEuPedro aqui no Twitter e no Instagram! ';

    Tweet.post('direct_messages/new',{
        user_id: toWhom,
        text: msgTxt
    });
    // .catch(err => {
    //     console.error("error",err.stack);
    // }).then(result => {
    //     console.log('Message sent to' + toWhom);
    // });
}

function followed(event){
    console.log('following event started');
    var who = event.source.name;
    // var screenName = event.source.screen_name;
    console.log(who);
    // directMsg(who);
    
}

function start(){
    console.log("Started!");
    // retweetSearch();
    // console.log('Search Retweeted');
    // stream.addListener("follow",followed);
    stream.on('follow',followed);

    // esses dois últimos não estão funcionando. Mesmo com um follow não entra na função e nem dá erro.
}

start();

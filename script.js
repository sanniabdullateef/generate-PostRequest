const generateButton = document.getElementById('post-request');
const postTitle = document.getElementById('post-title');
const postID = document.getElementById('post-id');
const postContent = document.getElementById('post-content');

const api = 'https://us-central1-open-classrooms-js-for-the-web.cloudfunctions.net/widgets';

function makeRequest (verb, url, data){
    return new Promise ((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(verb, url);
        request.onreadystatechange = () => {
            if (request.readyState === 4){
                if (request.status ===200 || request.status === 201){
                    resolve(JSON.parse(request.response));
                } else{
                    reject(JSON.parse(request.response));
                }
            }
        };
        if (verb === 'POST'){
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(data));
        } else {
            request.send();
        }
    }); 
}

async function createPost () {
    const uidPromise = makeRequest ('GET', api + '/generate-uid');
    const titlePromise = makeRequest ('GET', api + '/generate-title');
    const loremPromise = makeRequest ('GET', api + '/generate-lorem');

    const [uidResponse, titleResponse, loremResponse] = await Promise.all([uidPromise, titlePromise, loremPromise]);

    const postPromise = makeRequest('POST', api + '/create-post-with-uid', {
        uid: uidResponse.uid,
        title: titleResponse.title,
        content: loremResponse.lorem
    });

    const postResponse = await postPromise;

    postTitle.textContent = postResponse.post.title;
    postID.textContent = postResponse.post.id;
    postContent.textContent = postResponse.post.content;
}

generateButton.addEventListener ('click', () => {
    createPost();
})
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getHeaders = () =>{
    let headers = {"content-type" : "application/json"} as any;

    const token = localStorage.getItem("_token");

    if (token){
        headers["Authorization"] = `Token ${token}`;
    }    

    return headers;
};

function get(uri : string, signal? : AbortSignal) : Promise<any>{
    return fetchData(uri, "GET", null, signal);
}

function post(uri : string, data : any, signal? : AbortSignal) : Promise<any>{
    return fetchData(uri, "POST", data, signal);
}

function patch(uri : string, data : any, signal? : AbortSignal) : Promise<any>{   
    return fetchData(uri, "PATCH", data, signal);
}

function fetchData(uri: string, method: string,  data? : any, signal? : AbortSignal) : Promise<any>{
    let promise =  fetch(BACKEND_URL + uri,  
        { method: method, body: data && JSON.stringify(data), signal: signal , headers: getHeaders()});

    promise = addDefaultHandlers(promise);
    return promise;
};

function addDefaultHandlers(promise : Promise<any>){
    return promise
    .then(res => res.json())
    .catch((error) => { if (!(error instanceof DOMException)) { console.log(error); } });
}

const BackendApi = {
    get : get,
    post: post,
    patch : patch
};

export default BackendApi;
import 'isomorphic-fetch';
class Fetch {
    base(method, api, data, finallyFn){
        let headers = new Headers();
        // headers['Content-Type'] = "application/json;charset=utf-8";
        // headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
        // headers['Accept'] = 'application/json';
        headers.append('Content-Type', "application/json;charset=utf-8");
        // console.log(2);
        // let dataStr = '';
        // Object.keys(data).forEach((k, i) => {
        //      if(i === 0) {
        //          dataStr = k + '=' + data[k];
        //      }else{
        //          dataStr += '&' + k + '=' + data[k];
        //      }
        // });
        let init = {
            method: method,
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(data)
        };
        return fetch(api, init).then((res) => {
            if (res.ok){
                return res.json();
            }else{
                alert('网络超时');
            }
        });
    }
    get(api, data){
        return this.base('get', api, data);
    }
    post(api, data, finallyFn){
        return this.base('post', api, data);
    }
}
export default new Fetch();
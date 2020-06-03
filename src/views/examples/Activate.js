import React from 'react';
const axios = require('axios').default

class Activate extends React.Component {
    componentDidMount() {
        try {
            var mainurl = document.location.hash,
                params = mainurl.split('?')[1].split('&'),
                data = {},
                tmp
            for (var i = 0, l = params.length; i < l; i++) {
                tmp = params[i].split('=')
                data[tmp[0]] = tmp[1]
            }
            var useridother = data.u
            axios
                .post('/api/activate', {
                    UserActivated: true,
                    UserID: useridother,
                })
                .then(function (response) {
                    if (response.data === 'activated') {
                        window.location.hash = '#/admin/login'
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) { }
    }

    render() {
        return (<div></div>);
    }
}

export default Activate;
var api = new GoTrue();


var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var app = new Vue({
    el: "#app",

    data() {
        return {
            login_email: '',
            login_password: '',
            login_remember: true,
            signup_email: '',
            signup_password: '',
            page: '',
            user: api.currentUser(),
            users: null,
            message: '',
			code: qs['code'],
            provider: localStorage.getItem("provider"),
            _tm: null,
        }
    },


    methods: {

        getAdminUsers() {
            if (this.user){
                this.user.adminUsers()
                    .then((userData) => {
                        app.users = userData.users;
                    })
            }
        },


        login() {
            api.login(this.login_email, this.login_password, this.login_remember)
                .then((user) => {
                    app.show_message("Logged in");
                    app.login_email = '';
                    app.login_password = '';
                    app.user = user;
                    this.getAdminUsers();
                }, (err) => {
                    app.show_message(err.msg);
                })
        },

        signup() {
            api.signup(this.signup_email, this.signup_password)
                .then((user) => {
                    app.show_message("Account created");
                    app.signup_email = '';
                    app.signup_password = '';
                    app.page = '';
                }, (err) => {
                    app.show_message(err.msg);
                })
        },



        logout() {
            try {
                api.currentUser().logout()
                    .then(() => {
                        app.user = null;
                    });
            } catch (exc) {
                app.user = null;
            }

            this.show_message("Logged out");
        },

        show_message(txt) {
            this.message = txt;

            if (this._tm){
                clearInterval(this._tm)
            }

            this._tm = setTimeout(() => {
                app.message = '';
            }, 4000)
        }
    }
});


(function (angular) {
    'use strict';

    angular
        .module('movieClub')
        .controller('HostMeetingController', HostMeetingController);

    function HostMeetingController(currentMovie, currentMovieUser, users, userMovies) {
        var vm = this;
        vm.presentUsers = [];
        vm.absentUsers = getAbsentUsers();
        vm.currentMovie = currentMovie;

        vm.moveUserToPresent = moveUserToPresent;
        vm.moveUserToAbsent = moveUserToAbsent;
        vm.isMovieAvailable = isMovieAvailable;
        vm.selectMovie = selectMovie;

        function moveUserToPresent(user) {
            _.remove(vm.absentUsers, user);
            vm.presentUsers.push(user);
        }

        function moveUserToAbsent(user) {
            _.remove(vm.presentUsers, user);
            vm.absentUsers.push(user);
        }

        function getNextUserMovie(user) {
            var userMovieObj = _.find(userMovies, {'$id': user.$id});
            if (userMovieObj) {
                return _.find(userMovieObj.movies, {'order': 0});
            }
            return null;
        }

        function getAbsentUsers() {
            return _.map(users, function (user) {
                return {
                    id: user.$id,
                    username: user.username,
                    nextMovie: getNextUserMovie(user)
                };
            });
        }

        function isMovieAvailable() {
            return (getUsersWithMovies().length > 0);
        }

        function selectMovie() {
            var usersWithMovies = getUsersWithMovies();
            var userIndex = _.random(usersWithMovies.length - 1);
            var user = usersWithMovies[userIndex];
            currentMovie.name = user.nextMovie.name;
            currentMovie.$save();
            currentMovieUser.userId = user.id;
            currentMovieUser.$save();
        }

        function getUsersWithMovies() {
            return _.filter(vm.presentUsers, function (user) {
                return !!user.nextMovie;
            });
        }
    }

}(window.angular));
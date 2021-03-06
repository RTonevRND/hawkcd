/* Copyright (C) 2016 R&D Solutions Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular
    .module('hawk')
    .factory('userGroupUpdater', ['viewModel', function (viewModel) {
        var userGroupUpdater = this;

        userGroupUpdater.getUserGroups = function (userGroups) {
            viewModel.userGroups = userGroups;
        };

        userGroupUpdater.getUserGroupDTOs = function (userGroups) {
            viewModel.userGroups = userGroups;
        };

        userGroupUpdater.updateUserGroup = function (userGroup) {
            viewModel.userGroups.forEach(function (currentUserGroup, userGroupIndex, userGroupArray) {
                if(currentUserGroup.id == userGroup.id){
                    viewModel.userGroups[userGroupIndex] = userGroup;
                }
            });
        };

        userGroupUpdater.addUserGroup = function (userGroup) {
            viewModel.userGroups.push(userGroup);
        };

        return userGroupUpdater;
    }]);

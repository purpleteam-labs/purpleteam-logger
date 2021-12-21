// Copyright (C) 2017-2022 BinaryMist Limited. All rights reserved.

// This file is ancillary to PurpleTeam.

// purpleteam-logger is free software: you can redistribute it and/or modify
// it under the terms of the MIT License.

// purpleteam-logger is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// MIT License for more details.

module.exports = {

  rules: {
    // __set__ and __get__ are used in the rewire package
    'no-underscore-dangle': ['error', { allow: ['__set__', '__get__'] }],

    // lab expects assignments to be made to the flags parameter.
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['flags'] }]
  }
};

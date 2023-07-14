module.exports = {
    "roots": [
        "src"
    ],
    "transform": {
        "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
        '^.+\\.tsx?$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest',
    },
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!react)/',
        '\\.css$',
        '/node_modules/(?!react-syntax-highlighter)',
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
<<<<<<< HEAD
    }

}; 

=======
    },
    setupFiles: ["jest-webextension-mock"],

}; 
>>>>>>> ada7c207a807950688ee530570a75afe922f6414

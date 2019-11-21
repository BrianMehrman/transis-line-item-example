module.exports = {
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src$1'
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./src/spec/setupTests.js'],
  roots: [
    'src'
  ],
  testPathIgnorePatterns: [
    'node_modules/'
  ]
};

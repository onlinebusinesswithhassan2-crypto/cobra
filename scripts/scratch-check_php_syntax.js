import fs from 'fs';
import engine from 'php-parser';

const parser = new engine({
  parser: {
    extractDoc: true,
    php7: true
  },
  ast: {
    withPositions: true
  }
});

const content = fs.readFileSync('server_api/index.php', 'utf8');
try {
  const ast = parser.parseCode(content, 'index.php');
  console.log('✅ PHP Parse SUCCESS! No syntax error found in index.php.');
} catch (err) {
  console.error('❌ PHP Syntax Error in index.php:');
  console.error(err.message);
  console.error('Line:', err.lineNumber, 'Column:', err.columnNumber);
}

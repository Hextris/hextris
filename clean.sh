for file in $(find . -type f -name "*.js"); do touch filename2; grep -v "debugger\|console" $file > filename2; mv filename2 $file; done;


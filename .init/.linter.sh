#!/bin/bash
cd /tmp/kavia/workspace/code-generation/interactive-tic-tac-toe-e907f4b1/web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


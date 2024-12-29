# starting backend
cd backend
go mod tidy
go run main.go &

# starting frontend (waiting a bit to ensure backend starts first)
sleep 2
cd ../frontend
npm install
npm run dev
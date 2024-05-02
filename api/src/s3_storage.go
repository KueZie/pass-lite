package main

import (
	"context"
	"io"
	"log"

	googleStorage "cloud.google.com/go/storage"
)


type BucketStorage struct {
	BucketName string
}


/*
 * UploadFile uploads a file to the bucket
 * file: reader for the file to upload
 * fileName: name of the file to store in the bucket
 * returns: true if the file was uploaded successfully, false otherwise
 */
func (b *BucketStorage) UploadFile(file io.Reader, fileName string) (bool, error) {
	ctx := context.Background()
	client, err := googleStorage.NewClient(ctx)
	if err != nil {
		log.Fatalf("failed to create client: %v", err)
	}

	bucket := client.Bucket(b.BucketName)
	// location to store the file in the bucket
	obj := bucket.Object(fileName)

	w := obj.NewWriter(ctx)
	if _, err := io.Copy(w, file); err != nil {
		log.Fatalf("failed to write file: %v", err)
	}

	if err := w.Close(); err != nil {
		log.Fatalf("failed to close writer: %v", err)
	}

	log.Printf("file uploaded to %s/%s", b.BucketName, fileName)
	return true, nil
}


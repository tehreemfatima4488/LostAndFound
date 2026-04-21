exports.uploadImage = (req, res) => {
  console.log('Upload controller - req.file:', req.file);
  console.log('Upload controller - req.files:', req.files);
  console.log('Upload controller - req.body:', req.body);
  
  if (!req.file) {
    console.log('No file found in req.file');
    return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
  }
  console.log('File uploaded successfully:', req.file.filename);
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
};
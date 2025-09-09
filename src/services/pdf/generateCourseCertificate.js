import PDFDocument from "pdfkit";
import cloudinary from "cloudinary"; // Assume configured elsewhere, e.g., cloudinary.config({ cloud_name: process.env.CLOUD_NAME, ... });
import { v4 as uuidv4 } from "uuid"; // Install uuid: npm install uuid
import stream from "stream";

export const generateCertificatePDF = async (student, course) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 50,
    });

    // Generate unique certificate code
    const certCode = `CERT-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Pipe to a buffer stream
    const buffers = [];
    const pdfStream = new stream.PassThrough();
    doc.pipe(pdfStream);

    pdfStream.on("data", (chunk) => buffers.push(chunk));
    pdfStream.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Upload to Cloudinary
      try {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "certificates",
            resource_type: "raw",
            public_id: `${student.rollNumber}_${course.code}_${certCode}`,
            format: "pdf",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, code: certCode });
          }
        );

        // Write buffer to upload stream
        const bufferStream = new stream.PassThrough();
        bufferStream.end(pdfBuffer);
        bufferStream.pipe(uploadStream);
      } catch (err) {
        reject(err);
      }
    });

    // Design the certificate (customize as needed)
    doc.fontSize(30).text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(18).text(`This certifies that`, { align: "center" });
    doc.fontSize(24).text(`${student.firstName} ${student.lastName}`, { align: "center" });
    doc.fontSize(18).text(`has successfully completed the course`, { align: "center" });
    doc.fontSize(24).text(`${course.name}`, { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Roll Number: ${student.rollNumber}`, { align: "center" });
    doc.fontSize(14).text(`Completion Date: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.fontSize(14).text(`Certificate Code: ${certCode}`, { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).text("Issued by [Your Institution Name]", { align: "right" });

    // Add image/logo if available (e.g., doc.image(course.image, { fit: [100, 100], align: 'left' }));

    doc.end();
  });
};
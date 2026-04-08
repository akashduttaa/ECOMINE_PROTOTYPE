const ScanRecord = require('../models/ScanRecord');
const fs = require('fs');

exports.processScan = async (req, res) => {
  try {
    const { userWallet } = req.body;
    
    if (!req.file || !userWallet) {
      return res.status(400).json({ error: 'Image and userWallet are required' });
    }

    // Call AI Service (assuming it runs on localhost:8000)
    // Normally we'd use axios or node-fetch to send the multipart form data
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/analyze';
    
    // Fallback Mock if AI Service is down for test
    let aiResponseData = {
        success: true,
        device_model: "Mock iPhone",
        confidence: 0.95,
        materials: {"Gold (g)": 0.05, "Copper (g)": 15.0, "Lithium (g)": 2.5},
        eco_reward_estimate: 8.75
    };
    
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(aiServiceUrl, {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });
        if(response.ok) {
            aiResponseData = await response.json();
        } else {
            console.warn("AI Service error, using mock data");
        }
    } catch(e) {
        console.warn("AI Service unreachable, using mock data", e.message);
    }
    
    fs.unlinkSync(req.file.path); // remove uploaded file
    
    if (!aiResponseData.success) {
        return res.status(500).json({ error: 'AI processing failed' });
    }

    // In a real app we would save to MongoDB. Right now Mongoose is just mocked
    // const newRecord = new ScanRecord({
    //   userWallet,
    //   deviceModel: aiResponseData.device_model,
    //   estimatedMaterials: aiResponseData.materials,
    //   estimatedReward: aiResponseData.eco_reward_estimate,
    //   status: 'PENDING_DROPOFF'
    // });
    // await newRecord.save();

    // Mock record response
    const mockRecord = {
        _id: "mock_scan_" + Date.now(),
        userWallet,
        deviceModel: aiResponseData.device_model,
        estimatedMaterials: aiResponseData.materials,
        estimatedReward: aiResponseData.eco_reward_estimate,
        status: 'PENDING_DROPOFF'
    };

    res.status(200).json({ success: true, record: mockRecord });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verifyDropoff = async (req, res) => {
    try {
        const { scanId, workerWallet } = req.body;
        
        // This is where Transparent Ledger Informal Worker Integration occurs
        // 1. Fetch scan record from MongoDB
        // 2. Verify it's PENDING_DROPOFF
        // 3. Update status to VERIFIED_BY_WORKER
        // 4. Optionally signal blockchain to mint ECO tokens to user AND a cut to the worker
        
        // Mock success
        res.status(200).json({
            success: true,
            message: "Dropoff verified, rewards queued for blockchain issuance",
            scanId,
            workerWallet,
            status: "REWARD_ISSUED"
        });
        
    } catch(error) {
        res.status(500).json({ error: 'Server error' });
    }
}

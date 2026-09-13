#import <Foundation/Foundation.h>
#import <Vision/Vision.h>
#import <CoreImage/CoreImage.h>
#import <ImageIO/ImageIO.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>

// Local, non-generative extraction: the source face, clothing and pose are not redrawn.
// https://developer.apple.com/documentation/vision/vninstancemaskobservation
// Compile with clang -fobjc-arc and Foundation, Vision, CoreImage, ImageIO,
// CoreGraphics, CoreVideo and UniformTypeIdentifiers frameworks.
// Usage: extract-portrait source.jpg destination.png
int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc != 3) { NSLog(@"Pass a source photo and a destination PNG path."); return 1; }
        NSURL *sourceURL = [NSURL fileURLWithPath:@(argv[1])];
        NSURL *outputURL = [NSURL fileURLWithPath:@(argv[2])];
        if ([[NSFileManager defaultManager] fileExistsAtPath:outputURL.path]) {
            NSLog(@"Destination exists; choose a new versioned filename."); return 1;
        }
        CIImage *source = [CIImage imageWithContentsOfURL:sourceURL
            options:@{kCIImageApplyOrientationProperty: @YES}];
        if (!source) { NSLog(@"Cannot load the source photo."); return 1; }
        CGFloat scale = MIN(1, 2048 / MAX(source.extent.size.width, source.extent.size.height));
        source = [source imageByApplyingTransform:CGAffineTransformMakeScale(scale, scale)];
        VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCIImage:source options:@{}];
        VNGenerateForegroundInstanceMaskRequest *request = [VNGenerateForegroundInstanceMaskRequest new];
        NSError *error = nil;
        NSLog(@"Extracting the subject locally...");
        if (![handler performRequests:@[request] error:&error]) { NSLog(@"%@", error); return 1; }
        VNInstanceMaskObservation *observation = request.results.firstObject;
        if (!observation.allInstances.count) { NSLog(@"No foreground subject detected."); return 1; }

        // Pick the man at the center-right of this supplied photo, not other scenery.
        CVPixelBufferRef labels = observation.instanceMask;
        CVPixelBufferLockBaseAddress(labels, kCVPixelBufferLock_ReadOnly);
        size_t width = CVPixelBufferGetWidth(labels), height = CVPixelBufferGetHeight(labels);
        size_t stride = CVPixelBufferGetBytesPerRow(labels);
        unsigned char *data = CVPixelBufferGetBaseAddress(labels);
        unsigned char personLabel = data[(size_t)((height - 1) * 0.60) * stride + (size_t)((width - 1) * 0.57)];
        CVPixelBufferUnlockBaseAddress(labels, kCVPixelBufferLock_ReadOnly);
        if (!personLabel || ![observation.allInstances containsIndex:personLabel]) {
            NSLog(@"The photo's person could not be identified safely."); return 1;
        }
        CVPixelBufferRef buffer = [observation generateMaskedImageOfInstances:
            [NSIndexSet indexSetWithIndex:personLabel] fromRequestHandler:handler
            croppedToInstancesExtent:YES error:&error];
        if (!buffer) { NSLog(@"%@", error); return 1; }
        CIImage *extracted = [CIImage imageWithCVPixelBuffer:buffer];
        // Tighten only the alpha edge slightly to remove traces of sky/tree fringe.
        // Opaque source pixels are preserved, including the entire face and clothing.
        CIVector *alphaVector = [CIVector vectorWithX:0 Y:0 Z:0 W:1];
        CIVector *zeroVector = [CIVector vectorWithX:0 Y:0 Z:0 W:0];
        CIImage *matte = [extracted imageByApplyingFilter:@"CIColorMatrix" withInputParameters:@{
            @"inputRVector": alphaVector, @"inputGVector": alphaVector, @"inputBVector": alphaVector,
            @"inputAVector": zeroVector, @"inputBiasVector": alphaVector
        }];
        matte = [matte imageByApplyingFilter:@"CIMorphologyMinimum" withInputParameters:@{@"inputRadius": @1.5}];
        CIImage *clear = [[CIImage imageWithColor:[CIColor colorWithRed:0 green:0 blue:0 alpha:0]]
            imageByCroppingToRect:extracted.extent];
        extracted = [extracted imageByApplyingFilter:@"CIBlendWithMask" withInputParameters:@{
            @"inputBackgroundImage": clear, @"inputMaskImage": matte
        }];
        // A horizontal mirror makes the same photographed subject look right.
        CIImage *mirrored = [extracted imageByApplyingTransform:CGAffineTransformMakeScale(-1, 1)];
        mirrored = [mirrored imageByApplyingTransform:CGAffineTransformMakeTranslation(
            -mirrored.extent.origin.x, -mirrored.extent.origin.y)];
        CGImageRef image = [[CIContext context] createCGImage:mirrored fromRect:mirrored.extent];
        CGImageDestinationRef destination = CGImageDestinationCreateWithURL(
            (__bridge CFURLRef)outputURL, (__bridge CFStringRef)UTTypePNG.identifier, 1, NULL);
        if (!image || !destination) { NSLog(@"Cannot create a transparent PNG."); return 1; }
        CGImageDestinationAddImage(destination, image, NULL);
        BOOL saved = CGImageDestinationFinalize(destination);
        NSLog(@"Saved %zux%zu portrait, alpha format %u: %@", CGImageGetWidth(image),
            CGImageGetHeight(image), CGImageGetAlphaInfo(image), outputURL.path);
        CFRelease(destination);
        CGImageRelease(image);
        CVPixelBufferRelease(buffer);
        return saved ? 0 : 1;
    }
}

from django.conf import settings
import boto3
from botocore.client import Config


def init_boto():
    s3 = boto3.client(
        's3',
        config=Config(
            region_name='us-east-2',
            signature_version='s3v4',
            s3={
                'addressing_style': 'virtual',
            }
        ),
        aws_access_key_id=settings.AWS_S3_UPLOADER_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_S3_UPLOADER_SECRET_ACCESS_KEY
    )
    return s3
